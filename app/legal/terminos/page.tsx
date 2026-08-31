import type { Metadata } from "next";
import { LegalLayout } from "@/features/legal/components/LegalLayout";
import { termsData } from "@/features/legal/constants/termsData";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Leé los Términos y Condiciones de uso de ${siteConfig.name}: compra de entradas, sistema de predicciones, opiniones de la comunidad y relación con atletas.`,
  alternates: {
    canonical: `${siteConfig.url}/legal/terminos`,
  },
};

export default function TerminosPage() {
  return <LegalLayout document={termsData} />;
}
