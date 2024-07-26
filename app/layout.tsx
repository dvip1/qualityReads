import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createOptimizedIndexes } from "@/lib/createIndexes";
import { Providers } from "./providers";
import "./globals.css";
import 'react-toastify/ReactToastify.css';

createOptimizedIndexes();
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'QualityReads',
    template: '%s | QualityReads',
  },
  description: 'Post & Find Quality content to read or watch',
  keywords: ['QualityReads'], // Removed trailing comma in array
  authors: [{ name: 'Dvip Patel' }],
  creator: 'Dvip Patel',
  publisher: 'Dvip Patel',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'QualityReads', // Updated to reflect the site's title
    description: 'Post & Find Quality content to read or watch', // Made consistent with the metadata description
    url: 'https://quality-reads-tau.vercel.app/', // Corrected to the actual site URL
    siteName: 'QualityReads', // Updated to reflect the actual site name
    images: [
      {
        url: 'https://quality-reads-tau.vercel.app/write.svg', // Updated image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QualityReads', // Made consistent with the site's title
    description: 'Post & Find Quality content to read or watch', // Made consistent with the metadata description
    site: '@PatelDvip',
    creator: '@PatelDvip', // Ensure this is your actual Twitter handle
    images: ['https://quality-reads-tau.vercel.app/write.svg'], // Updated image URL
  },
  icons: {
    icon: '/favicon_io/favicon.ico',
  },
  manifest: '/favicon_io/site.webmanifest',
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