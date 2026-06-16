import { LangProvider } from "@/components/LangProvider";
import ClinicsContent from "@/components/ClinicsContent";

export const metadata = {
  title: "AuraVera — Anlaşmalı Klinikler / Partner Clinics",
};

export default function ClinicsPage() {
  return (
    <LangProvider>
      <ClinicsContent />
    </LangProvider>
  );
}
