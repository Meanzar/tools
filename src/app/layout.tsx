import type { Metadata } from "next";
import { Parisienne } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/header";

const parisienneSans = Parisienne({
  variable: "--font-parisienne-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const parisienneMono = Parisienne({
  variable: "--font-parisienne-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "toOlS",
  description: "Outils de gestion personnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${parisienneSans.variable} ${parisienneMono.variable} antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
