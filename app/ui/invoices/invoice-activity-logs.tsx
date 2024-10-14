import { formatDateToLocal } from "@/app/lib/utils";
import React from "react";
import { RestoreInvoiceActivity } from "@/app/ui/invoices/buttons";
import { InvoiceActivityLog } from "@/app/lib/definitions";
import Image from "next/image";

export default async function InvoiceActivityLogs({
  invoiceActivityLogs,
}: {
  invoiceActivityLogs: InvoiceActivityLog[];
}) {

  return (
    <table className="min-w-full text-gray-900 md:table">
      <thead className="rounded-lg text-left text-sm font-normal">
        <tr>
          <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
            Customer
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Old Status
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Current Status
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Date
          </th>
          <th scope="col" className="px-3 py-5 font-medium">
            Restore
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {invoiceActivityLogs?.map((invoiceActivityLog) => (
          <tr
            key={invoiceActivityLog.id}
            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
          >
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex items-center gap-3">
                <Image
                  src={invoiceActivityLog.image_url ?? ""}
                  className="rounded-full"
                  width={28}
                  height={28}
                  alt={`${invoiceActivityLog.name}'s profile picture`}
                />
                <p>{invoiceActivityLog?.name}</p>
              </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              {invoiceActivityLog.old_status}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              {invoiceActivityLog.current_status}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              {formatDateToLocal(invoiceActivityLog.date)}
            </td>
            <td className="whitespace-nowrap px-3 py-3">
              <RestoreInvoiceActivity invoiceActivityLog={invoiceActivityLog} />
            </td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
