import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dhaka Winter Morning - Rickshaw Scene',
  description: 'A beautiful animated scene of a rickshaw puller in foggy Dhaka',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
