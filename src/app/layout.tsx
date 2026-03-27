import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AI Readiness Gauntlet | How Ready Is Your Organization for AI? | Korcomptenz',
  description: 'Benchmark your AI maturity across 7 critical dimensions. Get a personalized readiness score, radar chart, and actionable recommendations from SmartForge.',
  keywords: ['AI readiness', 'AI maturity', 'digital transformation', 'SmartForge', 'Korcomptenz', 'AI assessment'],
  openGraph: {
    title: 'AI Readiness Gauntlet | Korcomptenz',
    description: 'How ready is your organization for AI? Take the 3-minute assessment and benchmark against 500+ enterprises.',
    type: 'website',
    siteName: 'Korcomptenz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Readiness Gauntlet | Korcomptenz',
    description: 'How ready is your organization for AI? Take the 3-minute assessment.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ background: '#0a1628' }}>
      <body className={`${inter.variable} font-sans antialiased`} style={{ background: '#0a1628', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
