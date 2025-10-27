'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type GReview = {
  author: string;
  profilePhotoUrl: string | null;
  rating: number | null;
  text: string;
  publishTime: string | null;
};

type GPayload = {
  name: string;
  rating: number | null;
  count: number | null;
  mapsUrl: string | null;
  reviews: GReview[];
};

type Props = {
  limit?: number;
  autoPlay?: boolean;
  intervalMs?: number;
  showHeader?: boolean;
  className?: string;
  /** Ativa o fallback quando não houver reviews do Google */
  enableFallback?: boolean;
  /** Lista personalizada de fallback (opcional) */
  fallbackReviews?: GReview[];
};

const DEFAULT_FALLBACK: GReview[] = [
  {
    author: 'Ana M.',
    profilePhotoUrl: null,
    rating: 5,
    text:
      'Equipa muito profissional. Cumpriram o prazo e deixaram tudo limpo. A minha cozinha parece nova!',
    publishTime: '2025-07-12',
  },
  {
    author: 'João R.',
    profilePhotoUrl: null,
    rating: 5,
    text:
      'Remodelação da casa de banho sem surpresas no orçamento. Adorei os acabamentos e a comunicação.',
    publishTime: '2025-06-28',
  },
  {
    author: 'Catarina S.',
    profilePhotoUrl: null,
    rating: 4,
    text:
      'Pintura interior impecável. Recomendo o cuidado com a proteção do mobiliário — excelente atenção ao detalhe.',
    publishTime: '2025-05-15',
  },
  {
    author: 'Miguel T.',
    profilePhotoUrl: null,
    rating: 5,
    text:
      'Troca de pavimento e portas: trabalho rápido e preciso. Orçamento transparente desde o início.',
    publishTime: '2025-04-02',
  },
  {
    author: 'Rita L.',
    profilePhotoUrl: null,
    rating: 5,
    text:
      'Reformaram a sala e abriram a cozinha. Acompanharam todo o processo e sugeriram soluções inteligentes.',
    publishTime: '2025-03-10',
  },
  {
    author: 'Pedro A.',
    profilePhotoUrl: null,
    rating: 4,
    text:
      'Excelente relação qualidade/preço. Voltarei a contratar para a varanda e a lavandaria.',
    publishTime: '2025-02-21',
  },
];

export default function GoogleReviewsCarousel({
  limit = 12,
  autoPlay = true,
  intervalMs = 4000,
  showHeader = true,
  className,
  enableFallback = true,
  fallbackReviews,
}: Props) {
  const [data, setData] = useState<GPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // carousel state
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // fetch Google data
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/google-reviews', { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load');
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setLoadError(e?.message || 'Failed to load');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // choose source (google or fallback)
  const { reviews, isGoogleSource, businessName, businessRating, businessCount, mapsUrl } =
    useMemo(() => {
      const googleReviews = (data?.reviews ?? []).filter((r) => r.text?.trim()?.length);
      const limitedGoogle = googleReviews.slice(0, limit);

      if (limitedGoogle.length > 0) {
        return {
          reviews: limitedGoogle,
          isGoogleSource: true,
          businessName: data?.name ?? 'Google Business',
          businessRating: data?.rating ?? null,
          businessCount: data?.count ?? null,
          mapsUrl: data?.mapsUrl ?? null,
        };
      }

      // no Google reviews -> fallback if enabled
      if (enableFallback) {
        const fb = (fallbackReviews && fallbackReviews.length ? fallbackReviews : DEFAULT_FALLBACK).slice(
          0,
          limit
        );
        return {
          reviews: fb,
          isGoogleSource: false,
          businessName: 'Opiniões de Clientes',
          businessRating: null,
          businessCount: null,
          mapsUrl: null,
        };
      }

      // nothing to show
      return {
        reviews: [] as GReview[],
        isGoogleSource: false,
        businessName: data?.name ?? 'Opiniões',
        businessRating: null,
        businessCount: null,
        mapsUrl: null,
      };
    }, [data, limit, enableFallback, fallbackReviews]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || isHovering || reviews.length < 2) return;
    const id = setInterval(() => goToIndex((activeIndex + 1) % reviews.length), intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, intervalMs, isHovering, activeIndex, reviews.length]);

  // helpers
  function goToIndex(i: number) {
    setActiveIndex(i);
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children.item(i) as HTMLElement | null;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  }
  function prev() {
    if (!reviews.length) return;
    goToIndex((activeIndex - 1 + reviews.length) % reviews.length);
  }
  function next() {
    if (!reviews.length) return;
    goToIndex((activeIndex + 1) % reviews.length);
  }

  // sync index with manual scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const handler = () => {
      const { scrollLeft } = el;
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children.item(i) as HTMLElement;
        const dist = Math.abs(child.offsetLeft - scrollLeft);
        if (dist < closestDist) {
          closest = i;
          closestDist = dist;
        }
      }
      setActiveIndex(closest);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // loading state
  if (!data && !enableFallback && !loadError) {
    return (
      <section className={className}>
        <div className="py-12 text-center text-sm text-neutral-500">A carregar avaliações…</div>
      </section>
    );
  }

  // empty (even fallback disabled)
  if (reviews.length === 0) {
    return (
      <section className={className}>
        <div className="py-12 text-center text-sm text-neutral-500">
          Sem avaliações disponíveis no momento.
        </div>
      </section>
    );
  }

  return (
    <section
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-roledescription="carousel"
    >
      {/* Header */}
      {showHeader && (
        <header className="mb-4 flex flex-col items-start justify-between gap-2 rounded-xl border bg-white/70 p-4 backdrop-blur md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold">{businessName}</h3>
            <p className="text-sm text-neutral-600">
              {isGoogleSource && businessRating ? `${businessRating.toFixed(1)} ★ · ` : ''}
              {isGoogleSource && typeof businessCount === 'number' ? `${businessCount} avaliações` : ''}
              {!isGoogleSource && 'Depoimentos internos'}
            </p>
          </div>
          {isGoogleSource && mapsUrl && (
            <Link href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline hover:opacity-80">
              Ver no Google
            </Link>
          )}
        </header>
      )}

      <div className="relative">
        {/* arrows */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Seguinte"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border bg-white/90 p-2 shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-4 p-1 pb-2"
          role="group"
          aria-label="Avaliações"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
          }}
        >
          {reviews.map((r, i) => (
            <article
              key={i}
              className="snap-center shrink-0 basis-[90%] sm:basis-[70%] md:basis-[55%] lg:basis-[40%] xl:basis-[33%] rounded-2xl border bg-white p-5 shadow"
            >
              <div className="mb-3 flex items-center gap-3">
                {r.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full" loading="lazy" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-neutral-200" />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{r.author}</div>
                  {r.publishTime && (
                    <div className="text-xs text-neutral-500">
                      {new Date(r.publishTime).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              {typeof r.rating === 'number' && (
                <div className="mb-2 text-yellow-500" aria-label={`${r.rating} de 5`}>
                  {'★★★★★'.slice(0, r.rating)}
                  {'☆☆☆☆☆'.slice(r.rating)}
                </div>
              )}

              <p className="text-sm text-neutral-800 line-clamp-6">{r.text}</p>
            </article>
          ))}
        </div>

        {/* dots */}
        {reviews.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para avaliação ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === activeIndex ? 'bg-blue-600' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                onClick={() => goToIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Attribution */}
      <p className="mt-3 text-center text-xs text-neutral-500">
        {isGoogleSource ? (
          <>
            Reviews fornecidas pela Google.{' '}
            {mapsUrl && (
              <Link href={mapsUrl} className="underline" target="_blank" rel="noopener noreferrer">
                Ver no Google
              </Link>
            )}
          </>
        ) : (
          'Depoimentos internos de clientes.'
        )}
      </p>
    </section>
  );
}
