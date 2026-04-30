/**
 * Root Layout Template
 *
 * Loads the three typefaces: Work Sans (headings), Inter (body), Space Grotesk (mono/labels)
 */

import type { Metadata } from 'next'
import { Inter, Work_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans", weight: ["400", "500", "600", "700"] })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: 'Workbench',  // CUSTOMIZE
  description: 'AI-powered workbench',  // CUSTOMIZE
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${workSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
