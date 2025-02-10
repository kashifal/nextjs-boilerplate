"use client";
import './globals.css';
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
 
import { ToastContainer } from "react-toastify";


export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        
          {children}
          <ToastContainer />
      
      </body>
    </html>
  )
}
