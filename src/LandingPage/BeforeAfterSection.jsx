import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";
import BeforeAfterModal from "../modals/BeforeAfterModal";

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source).auto("format");

export default function BeforeAfterSection() {
  const [projects, setProjects] = useState([]);
  const [sectionTitle, setSectionTitle] = useState({ beforeAfterTitle: "" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
          {
            "titleData": *[_type == "titleSection" && section == "beforeAfter"][0]{ beforeAfterTitle },
            "projects": *[_type == "testimonials"]{
              title, slug,
              beforeImage, afterImage,
              beforeImages, afterImages,
              challenge, result, rating,
              location, propertyType, areaSqft,
              service,
              timeline{startDate, endDate, durationWeeks},
              testimonial{quote, author, role}
            }
          }
        `;
        const data = await sanityClient.fetch(query);
        if (data?.titleData) setSectionTitle(data.titleData);
        if (data?.projects?.length) setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));

  if (!projects.length) return null;
  const item = projects[currentIndex];

  const beforeSrc = item.beforeImage?.asset
    ? urlFor(item.beforeImage).width(800).height(600).fit("crop").url()
    : null;
  const afterSrc = item.afterImage?.asset
    ? urlFor(item.afterImage).width(800).height(600).fit("crop").url()
    : null;
  const noImageText = showBefore ? "Before image not available" : "After image not available";

  return (
    <section className="w-full text-white py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide"
            style={{ color: "#f7e7ce" }}
          >
            {sectionTitle.beforeAfterTitle}
          </h2>

          <div className="flex gap-3 sm:gap-4 mt-4 md:mt-0">
            <button
              onClick={handlePrev}
              className="bg-white/10 backdrop-blur-sm border border-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f7e7ce]/20 transition active:scale-95"
              aria-label="Previous project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-white/10 backdrop-blur-sm border border-white/20 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f7e7ce]/20 transition active:scale-95"
              aria-label="Next project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex gap-6 mb-5 sm:mb-6 text-sm uppercase tracking-wide">
          <button
            onClick={() => setShowBefore(true)}
            className={`pb-1 border-b-2 transition ${
              showBefore ? "text-[#f7e7ce] border-[#f7e7ce]" : "text-white/60 border-transparent"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setShowBefore(false)}
            className={`pb-1 border-b-2 transition ${
              !showBefore ? "text-[#f7e7ce] border-[#f7e7ce]" : "text-white/60 border-transparent"
            }`}
          >
            After
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Image Block */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg min-h-[240px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[360px] max-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={showBefore ? "before" : "after"}
                src={showBefore ? beforeSrc || "" : afterSrc || ""}
                alt={showBefore ? "Before" : "After"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>

            {!((showBefore && beforeSrc) || (!showBefore && afterSrc)) && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm sm:text-base p-4 text-center bg-black/10 backdrop-blur-[2px]">
                {noImageText}
              </div>
            )}
          </div>

          {/* Text Block */}
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 sm:p-6 md:p-7 flex flex-col justify-between shadow-lg min-h-[240px] sm:min-h-[300px] md:min-h-[340px] lg:min-h-[360px]">
            <div className="absolute left-0 top-5 sm:top-6 h-8 sm:h-10 w-1.5 bg-[#f7e7ce] rounded-r-md" />

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-[#f7e7ce]">Client&apos;s Challenge</h3>
              <p className="mt-2 text-white/80 leading-relaxed text-sm sm:text-base">
                {item.challenge || "—"}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#f7e7ce]">Result</h3>
              <p className="mt-2 text-white/80 leading-relaxed text-sm sm:text-base">
                {item.result || "—"}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[#f7e7ce] font-semibold text-sm sm:text-base">
                ⭐ {item.rating ?? "—"} / 5
              </span>
              <button
                onClick={() => setOpen(true)}
                className="text-[#f7e7ce] hover:underline transition text-sm sm:text-base"
              >
                View More →
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {projects.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition ${
                i === currentIndex ? "bg-[#f7e7ce]" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <BeforeAfterModal open={open} onClose={() => setOpen(false)} initialItem={item} />
    </section>
  );
}
