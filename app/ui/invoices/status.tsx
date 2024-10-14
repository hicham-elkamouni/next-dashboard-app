import { restoreActivityLog, updateInvoiceStatus } from "@/app/lib/actions";
import { getDays } from "@/app/lib/utils";
import {
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

export default async function InvoiceStatus({
  status,
  createdAt,
  toggleDropDown,
  id: invoiceId,
}: {
  status: string;
  createdAt: string;
  toggleDropDown: () => void;
  id: string;
}) {
  const timeDiff = new Date().getTime() - new Date(createdAt).getTime();
  const isOverdue = getDays(timeDiff) >= 14;

  return (
    <span
      onClick={toggleDropDown}
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-gray-500": status === "pending" && !isOverdue,
          "bg-yellow-500 text-white":
            (status === "pending" && isOverdue) || status === "overdue",
          "bg-green-500 text-white": status === "paid",
          "bg-red-500 text-white": status === "canceled",
        }
      )}
    >
      {status === "pending" ? (
        isOverdue ? (
          <>
            Overdue
            <ExclamationCircleIcon className="ml-1 w-4 text-white" />
          </>
        ) : (
          <>
            Pending
            <ClockIcon className="ml-1 w-4 text-gray-500" />
          </>
        )
      ) : null}

      {status === "overdue" ? (
        <>
          Overdue
          <ExclamationCircleIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}

      {status === "paid" ? (
        <>
          Paid
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "canceled" ? (
        <>
          Canceled
          <XMarkIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}

// TO-DO = STATUSES SHOULD BE IN CONSTANT FILE
