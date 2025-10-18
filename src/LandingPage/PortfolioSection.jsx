import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioModal from "../modals/PortfolioModal";

// ======= Image URL builder utility =======
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source).auto("format");

export default function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [sectionTitle, setSectionTitle] = useState({ title: "", subtitle: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(null);

  // ======= Fetch Data (combined query for speed) =======
  useEffect(() => {
    const query = `{
      "sectionTitle": *[_type == "titleSection" && section == "portfolio"][0]{title, subtitle},
      "portfolioItems": *[_type == "portfolio"] | order(_createdAt desc){
        title, type, slug, coverImage
      }
    }`;
    setLoading(true);
    sanityClient
      .fetch(query)
      .then(({ sectionTitle, portfolioItems }) => {
        setSectionTitle(sectionTitle || { title: "", subtitle: "" });
        setPortfolioItems(portfolioItems || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (slugObj) => {
    if (!slugObj?.current) return;
    setActiveSlug(slugObj.current);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (!open) setActiveSlug(null);
  }, [open]);

  // ======= Memoize URLs for optimization =======
  const memoizedItems = useMemo(() => {
    return portfolioItems.map((item) => ({
      ...item,
      imageUrl: item.coverImage
        ? urlFor(item.coverImage).width(800).quality(90).url()
        : null,
    }));
  }, [portfolioItems]);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-gray-100">
      {/* Header */}
      <div className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl font-bold tracking-tight uppercase"
          style={{ color: "#f7e7ce" }}
        >
          {sectionTitle.title || "Portfolio"}
        </h2>
        <p className="mt-3 text-base md:text-lg text-[#f7e7ce]/80 max-w-2xl mx-auto">
          {sectionTitle.subtitle || "Explore my recent projects and creative work."}
        </p>
        <div className="w-28 h-1 mx-auto mt-6 bg-gradient-to-r from-[#f7e7ce] via-[#ffdfb3] to-[#f7e7ce] rounded-full animate-pulse" />
      </div>

      {/* Loader / Error */}
      {loading && (
        <div className="flex justify-center flex-wrap gap-4 animate-pulse">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-700/40 rounded-xl w-72 h-48 sm:w-80 sm:h-56"
              />
            ))}
        </div>
      )}
      {error && (
        <p className="text-center text-red-400 mt-6">
          Failed to load portfolio 😔
        </p>
      )}

      {/* Portfolio Grid */}
      {!loading && !error && (
        <div
          className="
            flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
            gap-5 md:gap-8 pb-4
            scroll-smooth snap-x snap-mandatory sm:snap-none
          "
        >
          {memoizedItems.slice(0, 8).map((item) => (
            <motion.article
              key={item.slug?.current || item.title}
              className="
                relative rounded-xl overflow-hidden group snap-start
                w-[80%] sm:w-full flex-shrink-0 aspect-[4/3]
                bg-gray-800/50
                hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300
              "
              onClick={() => handleOpen(item.slug)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.coverImage?.alt || item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
                  initial={{ opacity: 0, y: 15 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-white drop-shadow-md">
                    {item.title}
                  </h3>
                  {item.type && (
                    <p className="mt-1 text-sm font-medium text-white/90">
                      {item.type}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* View All Button */}
      {!loading && !error && (
        <div className="flex justify-center mt-12">
          <Link
            to="/portfolio-page"
            className="
              px-6 py-2.5 text-sm sm:text-base font-semibold
              bg-red-700 text-white rounded-full
              hover:bg-red-800 transition-colors duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              focus-visible:ring-offset-gray-900 focus-visible:ring-red-500
            "
          >
            View Full Portfolio
          </Link>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <PortfolioModal slug={activeSlug} open={open} onClose={handleClose} />
        )}
      </AnimatePresence>
    </section>
  );
}
