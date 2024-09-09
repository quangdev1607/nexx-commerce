import { Navbar } from "@/components/navigation/nav-bar";
import { ReactQueryClientProvider } from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Toaster from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexx Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="mx-auto max-w-7xl flex-grow px-6 md:px-12">
              <Navbar />
              <Toaster />
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
