"use client";

import { selectTab } from "@/app/lib/actions";
import { Tab, TABS } from "@/app/lib/constants";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const TabsFilter = ({ activeTab }: { activeTab: string }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleTabFilter = async (selectedTab: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (selectedTab !== TABS[0]) {
      params.set("status", selectedTab);
    } else {
      params.delete("status");
    }
    await selectTab(selectedTab);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex gap-3 bg-slate-200 rounded-md p-4">
      {TABS.map((tab: Tab) => (
        <button
          onClick={() => handleTabFilter(tab)}
          type="button"
          className={clsx(
            "bg-slate-400 w-24 text-white p-2 rounded-md hover:bg-slate-300",
            {
              "font-semibold text-green-400": tab === activeTab,
            }
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabsFilter;
