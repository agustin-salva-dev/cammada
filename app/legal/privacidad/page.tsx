import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/components/LegalLayout";
import { privacyData } from "@/features/legal/constants/privacyData";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Conocé cómo ${siteConfig.name} recopila, almacena y protege tus datos personales, de acuerdo con la Ley N° 25.326 de Protección de Datos Personales de Argentina.`,
  alternates: {
    canonical: `${siteConfig.url}/legal/privacidad`,
  },
};

export default function PrivacidadPage() {
  return <LegalLayout document={privacyData} />;
}
