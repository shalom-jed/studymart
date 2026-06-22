import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/NavbarNew";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "EduMart - The Student Marketplace",
  description: "Buy and sell past papers, notes, and resource books with verified students across Sri Lanka. The #1 educational marketplace for students.",
  keywords: "past papers, study notes, resource books, student marketplace, Sri Lanka, A/L, O/L",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[var(--em-gray-50)] text-[var(--em-gray-900)]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}