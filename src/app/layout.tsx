import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaProvider } from "@/components/providers/SolanaProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xpulse",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`} style={{ position: 'relative', minHeight: '100vh' }}>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            backgroundImage: "url('/background2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SolanaProvider>{children}</SolanaProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
