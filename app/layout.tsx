import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/shared/providers";
import { MSWProvider } from '@/shared/providers';

export const metadata: Metadata = {
  title: "Pickle",
  description: "실시간 할인 제보 및 소분모임 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <MSWProvider>
          <QueryProvider>{children}</QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
