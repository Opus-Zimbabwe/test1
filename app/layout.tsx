import "./globals.css"
import { Poppins, Geist } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Opus Zimbabwe — Digital Services for Zimbabwe",
  description:
    "Websites, software systems, AI automation, branding, domains, hosting and integrations for Zimbabwean organisations",
  icons: { icon: "/images/favicon-96x96.png", apple: "/images/logo.png" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans bg-white", geist.variable, poppins.variable)}
    >
      <body className="font-poppins">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
