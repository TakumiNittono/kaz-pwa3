import type { Metadata } from "next";
import "./globals.css";
import { OneSignalProvider } from "@/components/OneSignalProvider";

export const metadata: Metadata = {
  title: "Free Session App",
  description: "通知を受け取って特典をアンロック",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Free Session",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
      </head>
      <body>
        <OneSignalProvider>{children}</OneSignalProvider>
      </body>
    </html>
  );
}

