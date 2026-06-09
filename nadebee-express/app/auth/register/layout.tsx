import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Nadebee Express",
  description: "Buat akun baru di Nadebee Express untuk mulai menggunakan layanan kami.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}