import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import StyledComponentsRegistry from '../lib/registry'
const inter = Poppins({weight:'500', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Desafio Ti Saude',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{padding: 0, margin: 0}}>
      <body className={inter.className} style={{padding: 0, margin:0}}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
