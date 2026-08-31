import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Legal | Cammada Fight Session",
    default: "Legal | Cammada Fight Session",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
