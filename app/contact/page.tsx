import ContactForm from '@/components/ContactForm';

export default function Contact() {
  return (
    <main className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-12">Get in touch for a free, no-obligation quote.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Other ways to reach us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <a href="tel:+351000000000" className="text-blue-600 hover:underline text-lg">
                  +351 000 000 000
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                <a
                  href="https://wa.me/351000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-lg"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
