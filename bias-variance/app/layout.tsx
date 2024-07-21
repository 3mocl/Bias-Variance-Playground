import MainContent from "@/components/MainContent";
import type { Metadata } from "next";
import "./globals.css";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-base-100">
      <body>
        <main>
          <Navbar />
          <MainContent />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
