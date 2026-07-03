import RegisterCard from "@/components/auth/RegisterCard";
import { CammadaLogo } from "@/components/layout/CammadaLogo";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen py-8">
      <CammadaLogo />
      <RegisterCard />
    </div>
  );
}
