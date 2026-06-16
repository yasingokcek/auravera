import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuraVera | Sağlık Turizmi",
  description:
    "Saç ekimi, diş tedavisi, estetik ve obezite cerrahisi için ücretsiz danışmanlık. AuraVera ile sağlığınıza değer katın.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
