import "@/styles/globals.css";

import { type Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/components/providers";
import { env } from "@/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Notes",
  description:
    "Smart note-taking with AI-powered summaries. Create, edit, and organize your notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <html
        lang="en"
        className={`${dmSans.className} scroll-smooth`}
        suppressHydrationWarning
      >
        <body className="bg-background bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] dark:bg-[linear-gradient(to_right,rgba(128,128,128,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.1)_1px,transparent_1px)]">
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster
                toastOptions={{
                  className:
                    "rounded-base !shadow-shadow border-1 border-border bg-secondary-background text-foreground font-base p-3 text-sm",
                  duration: 2000,
                }}
              />
              {children}
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  );
}
