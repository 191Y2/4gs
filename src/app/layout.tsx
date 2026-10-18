import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "OCTAGON HQ — UFC 2026 Hub",
  description:
    "Unofficial UFC fan hub updated Oct 17, 2026: live champions, division rankings, fighter records in full detail, overall ratings, and a math-powered betting simulator with a $100 bankroll.",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#16181d",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f4f4f5",
            },
          }}
        />
      </body>
    </html>
  );
}
