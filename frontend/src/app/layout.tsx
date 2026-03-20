import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Obvis - AI Medical Agent",
  description: "Connect with specialist AI doctors for instant medical consultation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="font-sans antialiased selection:bg-teal-500/30 bg-slate-50 min-h-screen">
        <div className="relative z-10 bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
