import { Metadata } from 'next'
import { headers } from 'next/headers'
import { Inter } from "next/font/google";
import { createOptimizedIndexes } from "@/lib/createIndexes";
import { Providers } from "./providers";
import "./globals.css";
import 'react-toastify/ReactToastify.css';

createOptimizedIndexes();
const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers()
  const domain = headersList.get('host') || 'quality-reads-tau.vercel.app'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  return {
    title: {
      default: 'QualityReads',
      template: '%s | QualityReads',
    },
    description: 'Discover and share high-quality articles, videos, and content to read or watch. Join QualityReads to find the best content curated by our community.',
    keywords: ['QualityReads', 'high-quality content', 'articles', 'videos', 'curated content', 'reading', 'watching', 'community'],
    authors: [{ name: 'Dvip Patel' }],
    creator: 'Dvip Patel',
    publisher: 'Dvip Patel',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'QualityReads',
      description: 'Discover and share high-quality articles, videos, and content to read or watch. Join QualityReads to find the best content curated by our community.',
      url: `${protocol}://${domain}`,
      siteName: 'QualityReads',
      images: [
        {
          url: `${protocol}://${domain}/qualityreads.jpg`,
          width: 1200,
          height: 630,
          alt: 'QualityReads Logo',
        },
        {
          url: `${protocol}://${domain}/qualityreads.png`,
          width: 1200,
          height: 630,
          alt: 'QualityReads Alternate Image 1',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'QualityReads',
      description: 'Discover and share high-quality articles, videos, and content to read or watch. Join QualityReads to find the best content curated by our community.',
      site: '@PatelDvip',
      creator: '@PatelDvip',
      images: [
        `${protocol}://${domain}/qualityreads.jpg`,
        `${protocol}://${domain}/qualityreads.png`,
      ],
    },
    icons: {
      icon: '/favicon_io/favicon.ico',
    },
    manifest: '/favicon_io/site.webmanifest',
  }
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light dark:dark">
      <body className={`${inter.className} text-foreground bg-gradient-to-t from-[#cfd9df] to-[#e2ebf0] dark:bg-blend-multiply dark:bg-[#1b1a1b]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}