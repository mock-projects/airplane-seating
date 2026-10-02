import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Roboto } from "next/font/google";
import "../styles/app.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flights Dash",
  description: "Flights Dash Assessment",
  icons: {
    icon: "https://storage.googleapis.com/bb-logos/bb-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
