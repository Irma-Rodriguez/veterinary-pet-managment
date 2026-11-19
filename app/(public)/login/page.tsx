import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in | PawHaven Veterinary Clinic",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to PawHaven. Pet owners and clinic staff use this same page."
    >
      <LoginForm />
    </AuthCard>
  );
}
