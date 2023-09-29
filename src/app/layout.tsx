import Header from "@/components/Header/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["italic", "normal"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["italic", "normal"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nextjs Ecommerce",
  description: "This is shop where we sell online games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} `}>
      <body>
        <Header/>
        <main className="bg-primary-gradient min-h-screen ">{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
