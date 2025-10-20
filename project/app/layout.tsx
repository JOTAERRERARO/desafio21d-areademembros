import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ProgressProvider } from "@/src/context/ProgressContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Desafio Corpo Definido 21D - Elite Edition",
  description: "Transforme seu corpo em 21 dias com treinos intensos e mentalidade alpha",
  generator: "v0.app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ProgressProvider>
          {children}
        </ProgressProvider>
        <Analytics />
      </body>
    </html>
  )
}
