'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);

  // close on route hash change (basic) and when going to desktop
  useEffect(() => {
    const onHash = () => setOpen(false);
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setOpen(false);
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-blue-100/30 backdrop-blur-md text-neutral-900">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* top row */}
        <div className="flex h-14 items-center justify-between">
          {/* brand */}
          <Link href="/" className="flex items-center gap-2 rounded-xl px-2 py-1">
            <span className="inline-block h-6 w-6 rounded-md bg-blue-600" />
            <span className="font-semibold">RenoHome</span>
          </Link>

          {/* desktop links */}
          <ul className="hidden md:flex md:items-center md:gap-2">
            <li><NavLink href="/">Home</NavLink></li>

            {/* dropdown on desktop only */}
            <li className="group relative hidden md:block">
              <button
                className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Serviços <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-[520px] translate-y-1 rounded-xl border bg-white p-3 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-2">
                  <DropdownLink href="/servicos/cozinhas" title="Cozinhas" desc="Mobiliário, pisos e iluminação" />
                  <DropdownLink href="/servicos/wc" title="Casas de banho" desc="Louças, box e canalização" />
                  <DropdownLink href="/servicos/pintura" title="Pintura" desc="Interior e exterior" />
                  <DropdownLink href="/servicos/revestimentos" title="Revestimentos" desc="Pavimentos e paredes" />
                </div>
              </div>
            </li>

            <li className="hidden md:block"><NavLink href="/projetos">Projetos</NavLink></li>
            <li className="hidden md:block"><NavLink href="/opinioes">Opiniões</NavLink></li>
          </ul>

          {/* CTA desktop */}
          <div className="hidden md:block">
            <Link
              href="/orcamento"
              className="inline-flex items-center rounded-2xl border border-blue-300 px-4 py-2 text-sm font-semibold hover:bg-blue-50"
            >
              Pedir Orçamento
            </Link>
          </div>

          {/* hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 border border-blue-200 hover:bg-blue-50"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* mobile panel */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
            open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <ul className="flex flex-col py-2">
            <li><MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink></li>

            {/* dropdown as collapsible list on mobile */}
            <li className="px-2">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-2 py-2 hover:bg-blue-50">
                  <span>Serviços</span>
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <ul className="mt-1 space-y-1 rounded-xl border border-blue-100 bg-white p-2">
                  <li><MobileSublink href="/servicos/cozinhas" onClick={() => setOpen(false)} title="Cozinhas" /></li>
                  <li><MobileSublink href="/servicos/wc" onClick={() => setOpen(false)} title="Casas de banho" /></li>
                  <li><MobileSublink href="/servicos/pintura" onClick={() => setOpen(false)} title="Pintura" /></li>
                  <li><MobileSublink href="/servicos/revestimentos" onClick={() => setOpen(false)} title="Revestimentos" /></li>
                </ul>
              </details>
            </li>

            <li><MobileLink href="/projetos" onClick={() => setOpen(false)}>Projetos</MobileLink></li>
            <li><MobileLink href="/opinioes" onClick={() => setOpen(false)}>Opiniões</MobileLink></li>
            <li className="px-2 pt-2">
              <Link
                href="/orcamento"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-2xl border border-blue-300 px-4 py-2 font-semibold hover:bg-blue-50"
              >
                Pedir Orçamento
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

/* helpers */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, title, desc }: { href: string; title: string; desc?: string }) {
  return (
    <Link href={href} className="rounded-lg p-3 hover:bg-blue-50">
      <div className="text-sm font-semibold">{title}</div>
      {desc && <p className="text-xs text-neutral-600">{desc}</p>}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block w-full px-3 py-3 rounded-xl hover:bg-blue-50"
    >
      {children}
    </Link>
  );
}

function MobileSublink({
  href,
  title,
  onClick,
}: {
  href: string;
  title: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-3 py-2 hover:bg-blue-50 text-sm"
    >
      {title}
    </Link>
  );
}
