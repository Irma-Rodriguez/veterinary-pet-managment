export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-200"
    >
      {message}
    </p>
  );
}
