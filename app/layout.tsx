import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Home Renovation - Quality Renovations, On Time',
  description: 'Transparent quotes, skilled craftsmen, written warranty.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
