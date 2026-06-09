import { cookies } from "next/headers";
import UnauthorizedPage from "@/app/unauthorized"; 

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Satpam Utama: Cek jejak login (cookie)
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("nadebee-auth-token");

  // CASE 1: Belum login sama sekali -> Munculkan halaman tameng
  if (!hasToken) {
    return <UnauthorizedPage />;
  }

  // Jika sudah login, persilakan masuk ke pos pemeriksaan selanjutnya
  return <>{children}</>;
}