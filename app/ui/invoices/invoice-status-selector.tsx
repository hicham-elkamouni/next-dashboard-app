import {
  addInvoiceActivityLog,
  restoreActivityLog,
  updateInvoiceStatus,
} from "@/app/lib/actions";
import { Status } from "@/app/lib/constants";
import React from "react";

const InvoiceStatusSelector = ({
  statuses,
  toggleDropDown,
  id,
  currentStatus,
  date,
}: {
  statuses: Status[];
  toggleDropDown: () => void;
  id: string;
  currentStatus: Status;
  date: string;
}) => {
  return (
    <div className="z-10 absolute top-[30px] left-0 bg-slate-500 p-2 rounded-md space-y-2">
      {statuses?.map((status) => {
        const restoreActivityLogWithData = restoreActivityLog.bind(null, {
          current_status: currentStatus,
          old_status: status,
          invoice_id: id,
          date: date,
        });
        return (
          <form action={restoreActivityLogWithData} key={status}>
            <button
              type="submit"
              className="w-20 text-white bg-slate-600 hover:bg-slate-400 p-2 text-xs rounded-md"
            >
              {status}
            </button>
          </form>
        );
      })}
    </div>
  );
};

export default InvoiceStatusSelector;
