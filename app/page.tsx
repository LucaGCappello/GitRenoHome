import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Link from 'next/link';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarrousel';


export default function Home() {
  return (
    <main>
      <Hero />
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-3xl font-bold">O que dizem os nossos clientes</h2>
      <GoogleReviewsCarousel enableFallback />
    </main>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              title="Kitchens"
              description="Modern designs, quality materials, built to last."
            />
            <ServiceCard
              title="Bathrooms"
              description="Transform your space with expert tiling and fixtures."
            />
            <ServiceCard
              title="Full Renovations"
              description="Complete home makeovers, from concept to completion."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">See the Transformation</h2>
          <BeforeAfterSlider />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          <p className="text-lg text-slate-600 mb-8">Get a free, no-obligation quote today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Get a Quote
            </Link>
            <Link href="/portfolio" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
