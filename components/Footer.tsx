import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p className="text-lg font-semibold">HomeReno</p>
        <p className="text-sm">Quality renovations, on time, with no surprises.</p>

        <div className="mt-4 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <span>&copy; {year} HomeReno. All rights reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span>
            Responsible / built by{' '}
            <Link
              href="https://nextaaencywebsite.netlify.app/" // <— atualiza se necessário
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              Nexta Agency
            </Link>
            .
          </span>
        </div>
      </div>
    </footer>
  );
}