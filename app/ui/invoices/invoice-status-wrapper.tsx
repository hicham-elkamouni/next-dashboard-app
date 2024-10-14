"use client";

import React, { useEffect, useRef, useState } from "react";
import InvoiceStatus from "./status";
import InvoiceStatusSelector from "./invoice-status-selector";
import { Status, STATUSES } from "@/app/lib/constants";

const InvoiceStatusWrapper = ({
  status: currentStatus,
  createdAt,
  id,
}: {
  status: Status;
  createdAt: string;
  id: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDwonRef = useRef<HTMLDivElement>(null);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  // const openDropDown = () => {
  //   setIsOpen(true);
  // };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDwonRef.current &&
        !dropDwonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropDwonRef}>
      <InvoiceStatus
        id={id}
        status={currentStatus}
        createdAt={createdAt}
        toggleDropDown={toggleDropDown}
      />
      {isOpen && (
        <InvoiceStatusSelector
          statuses={STATUSES.filter((status) => status !== currentStatus)}
          currentStatus={currentStatus}
          date={createdAt}
          toggleDropDown={toggleDropDown}
          id={id}
        />
      )}
    </div>
  );
};

export default InvoiceStatusWrapper;
