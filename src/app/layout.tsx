
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThirdwebProvider } from 'thirdweb/react';
import { CreditsProvider } from '@/context/credits-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <title>Neon Canvanies</title>
        <meta name="description" content="A cyberpunk-themed web drawing application" />
      </head>
      <body className="font-body antialiased bg-background">
        <ThirdwebProvider>
          <CreditsProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
            <Toaster />
          </CreditsProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
