import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ship-it - Deploy Your Website in Minutes",
  description: "Effortlessly deploy and manage your websites with Ship-it",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
