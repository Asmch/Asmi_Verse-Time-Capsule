import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Hero from "./components/Hero";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "./provider"; // ✅ Added if you use SessionProvider here

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time Capsule App",
  description: "Create and send your time capsules to the future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        {/* ✅ Wrap with Providers if using SessionProvider */}
        <Providers>
          <AuthProvider>
            <Hero />
            <main>{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
