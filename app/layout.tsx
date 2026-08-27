import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const siteUrl = "https://www.kimdaae.com";
const title = "김다애 플래너│한분 한분 정성 플래닝";
const description = "김다애 웨딩플래너가 상담부터 본식까지 함께하는 1:1 퍼스널 웨딩 플래닝";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    images: [{ url: "/og-noto-palette.png", width: 1731, height: 909, alt: "DEARLY WEDDING — 결혼 준비가, 우리답게." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-noto-palette.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={notoSans.variable}>{children}</body>
    </html>
  );
}
