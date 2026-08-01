import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your alphaShop account to start shopping.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
