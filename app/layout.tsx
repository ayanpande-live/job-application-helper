import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitSignal Prototype — AI Job Fit and Application Strategy",
  description:
    "A private prototype that helps job seekers know if they fit before they apply.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
