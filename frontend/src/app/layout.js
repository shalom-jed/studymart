import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StudyMart - Student Marketplace",
  description: "Buy and sell past papers, notes, and resource books.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* The Navbar will now stick to the top of EVERY page */}
        <Navbar />

        {/* This represents whatever page the user is currently on */}
        {children}
      </body>
    </html>
  );
}