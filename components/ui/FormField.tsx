import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
};

// Label + input + hint + error messages, with the accessibility wiring
// (aria-invalid, aria-describedby) done once.
export function FormField({
  label,
  name,
  errors,
  hint,
  id = name,
  className = "",
  ...inputProps
}: FormFieldProps) {
  const hasError = Boolean(errors?.length);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={`block min-h-11 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-600 dark:bg-slate-950 dark:text-slate-100 ${
          hasError
            ? "border-rose-600 dark:border-rose-400"
            : "border-slate-300 dark:border-slate-700"
        } ${className}`}
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="text-sm text-slate-600 dark:text-slate-400">
          {hint}
        </p>
      )}
      {hasError && (
        <ul id={errorId} className="space-y-0.5">
          {errors!.map((error) => (
            <li
              key={error}
              className="text-sm font-medium text-rose-700 dark:text-rose-300"
            >
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
