import React, { useState, useId, useMemo } from "react";
import { Helmet } from "react-helmet";
import HeaderContainer from "../LandingPage/headerComponents/HeaderContainer";
import Footer from "../LandingPage/Footer";
import PageLayout from "../PageLayout";

const faqs = [
  {
    q: "What services do you provide?",
    a: "We offer textured designs, PU coatings, polyester lucido lamination, satin metallic coatings, luxury painting, clear PU coating, and melamine matt polishing.",
  },
  {
    q: "Do you handle custom color matching?",
    a: "Yes, custom color matching and finish consultation are available for both wood and veneer projects.",
  },
  {
    q: "How long does a typical project take?",
    a: "Lead times vary by scope and finish system; most residential projects complete within 1–3 weeks after approval.",
  },
  {
    q: "Are your finishes eco-friendly?",
    a: "We offer eco-conscious options and low-VOC systems where feasible without compromising durability.",
  },
  {
    q: "How can I get in touch?",
    a: "Use the Get In Touch page for inquiries; we usually respond within 24–48 hours on business days.",
  },
];

function FAQItem({ index, question, answer, openIndex, setOpenIndex, baseId }) {
  const isOpen = openIndex === index;
  const buttonId = `${baseId}-header-${index}`;
  const panelId = `${baseId}-panel-${index}`;

  return (
    <div className="border-b border-white/10">
      <h3 className="m-0" role="heading" aria-level={3}>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between gap-4 py-4 text-left text-white cursor-pointer hover:text-[#f7e7ce] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e7ce]/70"
          onClick={() => setOpenIndex(isOpen ? -1 : index)}
        >
          <span className="text-base sm:text-lg font-semibold">{question}</span>
          <span
            className={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-sm transition-transform ${isOpen ? "rotate-45" : ""}`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>

      <section
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${isOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0"}`}
      >
        <div className="pb-5 text-sm sm:text-base text-neutral-200">
          {answer}
        </div>
      </section>
    </div>
  );
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  const faqJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  }), []);

  return (
    <PageLayout>
      <HeaderContainer />

      <main className="min-h-screen pt-[72px]">
        <Helmet>
          <title>FAQs | Star Colours Coating</title>
          <meta
            name="description"
            content="Frequently asked questions about finishes, coatings, timelines, eco-friendly options, and contact details."
          />
          <script type="application/ld+json">
            {JSON.stringify(faqJsonLd)}
          </script>
        </Helmet>

        <section className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#f7e7ce]">
              Frequently Asked Questions
            </h1>
            <div className="w-20 h-1 rounded-full mx-auto mt-4 bg-[#f7e7ce]" />
            <p className="mt-4 text-neutral-300">
              Answers to common questions about our finishes, coatings, and process.
            </p>
          </header>

          <div className="rounded-xl bg-[rgba(25,5,3,0.6)] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="px-4 sm:px-6 divide-y divide-white/10">
              {faqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  index={idx}
                  question={faq.q}
                  answer={faq.a}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  baseId={baseId}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/getintouch"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition"
            >
              Still have questions? Contact us →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </PageLayout>
  );
}
