import { Metadata } from "next";
import PelangganClientLayout from "./PelangganClientLayout"; // Kita buat di bawah

export const metadata: Metadata = {
  title: "Dashboard Pelanggan | Nadebee Express",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PelangganClientLayout>{children}</PelangganClientLayout>;
}