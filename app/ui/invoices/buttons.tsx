import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  cancelInvoice,
  deleteInvoice,
  restoreActivityLog,
} from "@/app/lib/actions";
import clsx from "clsx";
import { InvoiceActivityLog } from "@/app/lib/definitions";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function CancelInvoice({
  id,
  isCanceled,
}: {
  id: string;
  isCanceled: boolean;
}) {
  const cancelInvoiceWithId = cancelInvoice.bind(null, id);

  return (
    <form action={cancelInvoiceWithId}>
      <button
        type="submit"
        className={clsx("rounded-md border p-2 ", {
          "hover:bg-gray-100": !isCanceled,
          "bg-slate-200 opacity-50 cursor-not-allowed": isCanceled,
        })}
      >
        <span className="sr-only">Cancel</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function RestoreInvoiceActivity({
  invoiceActivityLog,
}: {
  invoiceActivityLog: InvoiceActivityLog;
}) {
  const restoreActivityLogWithData = restoreActivityLog.bind(
    null,
    invoiceActivityLog
  );
  return (
    <form action={restoreActivityLogWithData}>
      <button
        type="submit"
        className={
          "rounded-md p-2 inline-flex items-center px-2 py-1 bg-green-300 text-white border border-tranparent hover:bg-transparent hover:text-black hover:border hover:border-green-300"
        }
      >
        <span className="">Restore</span>
        <ArrowPathIcon className="ml-1 w-4" />
      </button>
    </form>
  );
}
