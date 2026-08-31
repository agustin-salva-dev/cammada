import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/components/LegalLayout";
import { disclaimerData } from "@/features/legal/constants/disclaimerData";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Descargo de Responsabilidad",
  description: `Descargo de responsabilidad de ${siteConfig.name}: naturaleza de los deportes de combate, carácter no-apuesta del sistema de predicciones y exactitud de la información publicada.`,
  alternates: {
    canonical: `${siteConfig.url}/legal/disclaimer`,
  },
};

export default function DisclaimerPage() {
  return <LegalLayout document={disclaimerData} />;
}
