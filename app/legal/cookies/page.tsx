import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/components/LegalLayout";
import { cookiesData } from "@/features/legal/constants/cookiesData";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: `Información sobre las cookies que utiliza ${siteConfig.name}: qué son, cuáles usamos y cómo podés gestionarlas desde tu navegador.`,
  alternates: {
    canonical: `${siteConfig.url}/legal/cookies`,
  },
};

export default function CookiesPage() {
  return <LegalLayout document={cookiesData} />;
}
