import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "世界探索マップ | SNSコンテンツ発掘ツール",
  description: "ミクロな世界（サメの世界、鉄の世界、フィギュアの世界など）を階層的に探索できるSNSコンテンツ発掘ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
