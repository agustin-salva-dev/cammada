import LoginCard from "@/components/auth/LoginCard";
import { CammadaLogo } from "@/components/layout/CammadaLogo";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen">
      <CammadaLogo />
      <LoginCard />
    </div>
  );
}
