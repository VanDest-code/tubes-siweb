import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Nadebee Express",
  description: "Silakan masuk ke akun Nadebee Express Anda",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout ini hanya bertugas menyuntikkan title ke tab browser,
  // lalu memunculkan konten page.tsx login milikmu tanpa merusaknya.
  return <>{children}</>;
}