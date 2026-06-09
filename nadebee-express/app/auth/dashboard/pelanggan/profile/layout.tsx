import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Pelanggan | Nadebee Express",
  description: "Pengaturan akun dan profil pelanggan Nadebee Express",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}