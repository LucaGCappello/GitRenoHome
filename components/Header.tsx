'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // optional helper — remove if not using

export default function Header() {
  const [open, setOpen] = useState(false);

  // close menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-100/30 backdrop-blur-md border-b border-blue-200/20 text-neutral-900">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          HomeReno
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6 font-medium">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/portfolio">Portfolio</NavLink>
          {/* <NavLink href="/feedback">Feedback</NavLink> */}
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 bg-blue-100/50 backdrop-blur-md border-t border-blue-200/30',
          open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col items-start px-4 py-2 gap-2 font-medium">
          <MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink>
          <MobileLink href="/portfolio" onClick={() => setOpen(false)}>Portfolio</MobileLink>
          {/* <MobileLink href="/feedback" onClick={() => setOpen(false)}>Feedback</MobileLink> */}
          <MobileLink href="/contact" onClick={() => setOpen(false)}>Contact</MobileLink>
        </nav>
      </div>
    </header>
  );
}

/* helper components */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full rounded-lg px-3 py-2 hover:bg-blue-50 transition"
    >
      {children}
    </Link>
  );
}
