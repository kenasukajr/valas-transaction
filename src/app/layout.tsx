import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RefreshProvider } from "@/context/RefreshContext"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Form Data Diri",
  description: "Aplikasi input data diri dengan Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <RefreshProvider>
          {children}
          <Toaster />
        </RefreshProvider>
      </body>
    </html>
  )
}
