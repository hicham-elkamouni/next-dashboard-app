"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { TABS } from "./constants";
import { InvoiceActivityLog } from "./definitions";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid", "canceled", "overdue"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  old_status: z.string().optional(),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    old_status: formData.get("old_status"),
    date: formData.get("date"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status, old_status, date } = validatedFields.data;

  await addInvoiceActivityLog({
    invoice_id: id,
    old_status: old_status!,
    current_status: status,
    date: date,
  });

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice" };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

export async function cancelInvoice(id: string) {
  try {
    await sql`UPDATE invoices SET status = 'canceled' WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Canceled Invoice" };
  } catch (error) {
    return { message: "Database Error: Failed to Cancel Invoice." };
  }
}

export async function updateInvoiceStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  try {
    await sql`UPDATE invoices SET status = ${status} WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Updated Invoice Status" };
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice Status." };
  }
}

export async function addInvoiceActivityLog(
  invoiceAcivityLogData: Omit<InvoiceActivityLog, "id" | "customer_name">
) {
  const {
    invoice_id,
    old_status,
    current_status,
    date,
  } = invoiceAcivityLogData;
  try {

    await sql`
      INSERT INTO invoice_activity_logs (invoice_id, old_status, current_status, date)
      VALUES (${invoice_id}, ${old_status}, ${current_status}, ${date})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Add Invoice Activity Log.",
    };
  }
}

export async function restoreActivityLog(
  invoiceAcivityLog: InvoiceActivityLog
) {
  const { old_status : comingStatus, invoice_id } = invoiceAcivityLog;
  try {
    await sql`BEGIN`;
    await updateInvoiceStatus({ status: comingStatus, id: invoice_id });
    await addInvoiceActivityLog(invoiceAcivityLog);
    await sql`COMMIT`;
    // revalidatePath("/dashboard/invoices");
  } catch (error) {
    await sql`ROLLBACK`;
    return {
      message: "Database Error: Failed to Restore Invoice Activity Log.",
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function selectTab(selectedTab: string) {
  const cookiesStore = cookies();
  selectedTab !== TABS[0]
    ? cookiesStore.set("status", selectedTab, { maxAge: 31536000000 })
    : cookiesStore.delete("status");
}
