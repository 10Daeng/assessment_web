import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lentera Batin - Lembaga Pengembangan Diri & Pemulihan Batin",
  description: "Pahami dirimu, temukan potensimu, dan tata ulang hidupmu dengan pendekatan grafologi dan metodologi refleksi batin terstruktur.",
  keywords: ["pengembangan diri", "asesmen kepribadian", "grafologi", "konseling", "psikotes", "self improvement", "karier", "self discovery"],
  authors: [{ name: "Lentera Batin" }],
  creator: "Lentera Batin",
  publisher: "Lentera Batin",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://lenterabatin.com",
    siteName: "Lentera Batin",
    title: "Lentera Batin - Lembaga Pengembangan Diri & Pemulihan Batin",
    description: "Pahami dirimu, temukan potensimu, dan tata ulang hidupmu dengan pendekatan grafologi dan metodologi refleksi batin terstruktur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lentera Batin - Pengembangan Diri & Pemulihan Batin"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Lentera Batin - Lembaga Pengembangan Diri & Pemulihan Batin",
    description: "Pahami dirimu, temukan potensimu, dan tata ulang hidupmu dengan pendekatan grafologi dan metodologi refleksi batin terstruktur.",
    creator: "@lenterabatin",
    images: {
      url: "/og-image.jpg",
      alt: "Lentera Batin - Pengembangan Diri & Pemulihan Batin"
    }
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://lenterabatin.com",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
  }
};

export default function RootLayout({ children }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lenterabatin.com";

  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Lentera Batin",
              "description": "Lembaga Pengembangan Diri & Pemulihan Batin",
              "url": baseUrl,
              "logo": `${baseUrl}/logo.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@lenterabatin.com",
                "telephone": `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285117778798'}`,
                "availableLanguage": "Indonesian"
              },
              "sameAs": [
                "https://www.instagram.com/lenterabatin",
                "https://www.facebook.com/lenterabatin",
                "https://www.linkedin.com/company/lenterabatin"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} font-sans antialiased bg-slate-50`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
