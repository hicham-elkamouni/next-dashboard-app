export const STATUSES = ["paid", "pending", "canceled", "overdue"] as const;

export type Status = (typeof STATUSES)[number];

export const TABS = ["all", "paid", "pending", "canceled", "overdue"] as const;

export type Tab = (typeof TABS)[number];