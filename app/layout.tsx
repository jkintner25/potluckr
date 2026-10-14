import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'Potluckr',
  description: 'Plan a potluck with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var saved=localStorage.getItem('potluckr-theme');document.documentElement.dataset.theme=saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}` }} />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
