import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ignyto Tutoring",
    default: "Ignyto Tutoring - Premier Academic & Summer Camps",
  },
  description: "Join Ignyto Tutoring to inspire students with innovative challenges, online academic programs, and expert-led summer camps in Math, Coding, and logic.",
  keywords: ["tutoring", "summer camps", "math camps", "coding camps", "online tutoring", "academic competitions", "STEM learning", "Ignyto", "Nirmeva", "Nirmeva Studio", "Nirmeva Web Development"],
  authors: [{ name: "Ignyto Tutoring" }, { name: "Nirmeva", url: "https://www.nirmeva.com/?utm_source=ignyto_tutoring&utm_medium=seo_author" }],
  creator: "Nirmeva",
  openGraph: {
    title: "Ignyto Tutoring - Premier Academic & Summer Camps",
    description: "Join Ignyto Tutoring to inspire students with innovative challenges, online academic programs, and expert-led summer camps.",
    url: "https://ignyto.com",
    siteName: "Ignyto Tutoring",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignyto Tutoring - Premier Academic & Summer Camps",
    description: "Join Ignyto Tutoring to inspire students with innovative challenges, online academic programs, and expert-led summer camps.",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
