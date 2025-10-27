import Link from 'next/link';


export default function Hero() {
  return (
    <section className="relative isolate text-white">
      {/* Background video */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        poster="/video-poster.jpg" // optional: fallback frame
      >
        <source src="/VideoCost.mp4" type="video/webm" />
        <source  src="/VideoConst.mp4" type="video/mp4" />
      </video>

      {/* Subtle gradient overlay for readability */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/60 via-blue-900/30 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto max-w-4xl px-4 py-32 text-center md:py-40">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl">
          We renovate your home. On time, with no surprises.
        </h1>
        <p className="mb-10 text-xl text-blue-100 md:text-2xl">
          Transparent quotes, skilled craftsmen, written warranty.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Get a Quote
          </Link>
          <Link
            href="/portfolio"
            className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
