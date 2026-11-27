import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account | PawHaven Veterinary Clinic",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Register as a pet owner to add your pets and book appointments online."
    >
      <RegisterForm />
    </AuthCard>
  );
}
