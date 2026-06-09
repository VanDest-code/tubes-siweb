import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: "Nadebee Express",
  description: "Layanan pengiriman dan pickup paket terpercaya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body 
        className={`${poppins.variable} font-poppins antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}