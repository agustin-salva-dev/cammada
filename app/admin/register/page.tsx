import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterCard from "@/components/auth/RegisterCard";
import { CammadaLogo } from "@/components/layout/CammadaLogo";

export default async function RegisterPage() {
  const session = await auth();
  const role = session?.user?.role;

  // Only authenticated SUPERADMIN or ADMIN can access this page.
  const isAllowed = role === "SUPERADMIN" || role === "ADMIN";

  if (!isAllowed) {
    // Pass an error code so LoginCard can display the appropriate toast.
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
