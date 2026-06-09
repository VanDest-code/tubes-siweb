import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Kurir | Nadebee Express",
  description: "Data diri dan informasi pahlawan paket Nadebee Express",
};

export default function ProfilKurirLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}