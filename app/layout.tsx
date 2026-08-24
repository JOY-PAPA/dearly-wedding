import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const title = "디어리 웨딩 | 우리다운 결혼 준비";
const description = "웨딩홀부터 스드메, 플래너까지 취향에 맞춰 큐레이션하는 웨딩 플랫폼";

export const metadata: Metadata = {
  metadataBase: new URL("https://dearly-wedding.yihyeon-papa.chatgpt.site"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://dearly-wedding.yihyeon-papa.chatgpt.site",
    images: [{ url: "/og-noto.png", width: 1731, height: 909, alt: "DEARLY WEDDING — 결혼 준비가, 우리답게." }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-noto.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={notoSans.variable}>{children}</body>
    </html>
  );
}
