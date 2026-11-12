type AppointmentStatus = "scheduled" | "completed" | "canceled";

const styles: Record<AppointmentStatus, string> = {
  scheduled: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  canceled: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
};

const labels: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
