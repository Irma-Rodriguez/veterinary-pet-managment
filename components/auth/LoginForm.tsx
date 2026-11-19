"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormAlert } from "./FormAlert";

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    // Page the user tried to open before signing in (set by proxy.ts).
    const next = new URLSearchParams(window.location.search).get("next");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          next,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setErrors(result.fieldErrors ?? {});
        setMessage(result.message ?? "Something went wrong.");
        setPending(false);
        return;
      }

      router.replace(result.redirectTo);
      router.refresh();
    } catch {
      setMessage("Could not reach the server. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormAlert message={message} />

      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        errors={errors.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={errors.password}
      />

      <Button
        type="submit"
        pending={pending}
        pendingText="Signing in…"
        className="w-full"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        New to PawHaven?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary-700 underline-offset-4 hover:underline dark:text-primary-300"
        >
          Create an owner account
        </Link>
      </p>
    </form>
  );
}
