export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg font-semibold mb-2">HomeReno</p>
        <p className="text-sm">Quality renovations, on time, with no surprises.</p>
        <p className="text-sm mt-4">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
