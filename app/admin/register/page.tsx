import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterCard from "@/features/auth/components/RegisterCard";
import { CammadaLogo } from "@/components/layout/CammadaLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crea una cuenta | Cammada",
  description: "Registrate para obtener acceso al panel de control de Cammada.",
};

export default async function RegisterPage() {
  const session = await auth();
  const role = session?.user?.role;

  const isAllowed = role === "SUPERADMIN" || role === "ADMIN";

  if (!isAllowed) {
    const reason = session ? "Unauthorized" : "Unauthenticated";
    redirect(`/admin?error=${reason}`);
  }

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen py-8">
      <CammadaLogo />
      <RegisterCard />
    </div>
  );
}
