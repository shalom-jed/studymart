import "./globals.css"; // <-- This is the magic line

export const metadata = {
  title: "StudyMart",
  description: "Marketplace for student resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}