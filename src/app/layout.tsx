

import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
// import { AuthProvider } from "@/components/context/AuthContext"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Dexa Test",
  description: "HRIS System",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        {/* <AuthProvider> */}
         <Toaster/>
          {children}
      </body>
    </html>
  )
}