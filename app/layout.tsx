'use client'

// app/layout.tsx
import React from 'react';
import { EuiProvider,  EuiPage, EuiPageBody, EuiPageHeader, EuiPageSection, EuiButton } from '@elastic/eui';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EuiProvider>
          <EuiPage>
            <EuiPageBody>
              <EuiPageHeader
                pageTitle="Application Title"
                rightSideItems={[
                  <EuiButton key="button">Action</EuiButton>,
                ]}
              />
              <EuiPageSection>
                {children}
              </EuiPageSection>
            </EuiPageBody>
          </EuiPage>
        </EuiProvider>
      </body>
    </html>
  );
}
