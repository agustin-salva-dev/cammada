import { Suspense } from "react";
import LoginCard from "@/features/auth/components/LoginCard";
import { CammadaLogo } from "@/components/layout/CammadaLogo";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-screen">
      <CammadaLogo />
      <Suspense>
        <LoginCard />
      </Suspense>
    </div>
  );
}
