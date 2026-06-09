import { Metadata } from "next";
import KurirClientLayout from "./KurirClientLayout"; // Kita buat di bawah

export const metadata: Metadata = {
  title: "Dashboard Kurir | Nadebee Express",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <KurirClientLayout>{children}</KurirClientLayout>;
}