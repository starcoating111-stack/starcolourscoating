import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from 'react-dom'; // 1. IMPORT REACTDOM
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

// ... (your helper functions: builder, urlFor, formatDate are all perfect) ...
const builder = imageUrlBuilder(sanityClient);
const urlFor = (src) => {
  try {
    return builder.image(src).auto("format");
  } catch {
    return null;
  }
};
const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};


export default function BeforeAfterModal({ slug, open, onClose, initialItem }) {
  const [item, setItem] = useState(initialItem || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("After");
  const [selectedIdx, setSelectedIdx] = useState(0);

  // ... (All your useEffect and useMemo hooks are perfectly fine, no changes needed) ...
  useEffect(() => {
    if (!open) return;
    setActiveTab("After");
    setSelectedIdx(0);
    if (initialItem) {
      setItem(initialItem);
      return;
    }
    if (!slug) return;
    setLoading(true);
    sanityClient
      .fetch(
        `*[_type == "testimonials" && slug.current == $slug][0]{
          title, slug,
          beforeImage, afterImage,
          beforeImages[]{..., asset->}, afterImages[]{..., asset->},
          challenge, result, rating,
          location, propertyType, areaSqft,
          service,
          timeline{startDate, endDate, durationWeeks},
          testimonial{quote, author, role}
        }`,
        { slug }
      )
      .then((data) => setItem(data || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, slug, initialItem]);

  const beforeSet = useMemo(() => {
    if (!item) return [];
    const single = item.beforeImage ? [item.beforeImage] : [];
    const multi = Array.isArray(item.beforeImages)
      ? item.beforeImages.filter(Boolean)
      : [];
    return [...single, ...multi];
  }, [item]);
  const afterSet = useMemo(() => {
    if (!item) return [];
    const single = item.afterImage ? [item.afterImage] : [];
    const multi = Array.isArray(item.afterImages)
      ? item.afterImages.filter(Boolean)
      : [];
    return [...single, ...multi];
  }, [item]);
  
  const activeImages = activeTab === "Before" ? beforeSet : afterSet;
  const mainSrc = useMemo(() => {
    const img = activeImages[selectedIdx];
    if (!img) return null;
    return urlFor(img)?.width(1400)?.height(1000)?.fit("crop")?.quality(85)?.url() || null;
  }, [activeImages, selectedIdx]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [activeTab, item]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const originalStyle = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle.overflow || "";
      document.body.style.paddingRight = originalStyle.paddingRight || "";
    };
  }, [open]);


  if (!open) return null;

  // 2. WRAP THE ENTIRE RETURN IN ReactDOM.createPortal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Centered container */}
      <div className="relative w-full max-w-[1200px] h-[90vh] mx-auto px-2 sm:px-4">
        <div className="relative w-full h-full bg-[rgb(32,6,3)] text-gray-100 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col p-4 sm:p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>

          {/* ... (rest of your modal JSX is identical) ... */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1 min-h-0 overflow-hidden pr-5">      
        {/* Left: Image viewer */}
            <div className="lg:col-span-6 flex flex-col h-[50vh] sm:h-full min-h-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
              {/* Toggle buttons */}
              <div className="flex gap-4 px-3 pt-3 text-xs sm:text-sm uppercase tracking-wide justify-center sm:justify-start">
                {["Before", "After"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-1 border-b-2 transition ${
                      activeTab === tab
                        ? "text-[#f7e7ce] border-[#f7e7ce]"
                        : "text-white/60 border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div className="flex-1 min-h-0 bg-[rgb(32,6,3)]">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    Loading...
                  </div>
                ) : mainSrc ? (
                  <img
                    src={mainSrc}
                    alt={`${activeTab} image`}
                    className="w-full h-full object-contain sm:object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No {activeTab} image
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              <div className="px-3 py-2 sm:px-4 sm:py-3 bg-white/5 border-t border-white/10">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
                  {activeImages.map((img, idx) => {
                    const src = urlFor(img)?.width(200)?.height(140)?.fit("crop")?.url();
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIdx(idx)}
                        className={`relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border transition
                          ${
                            idx === selectedIdx
                              ? "border-red-500 ring-2 ring-red-500/40"
                              : "border-white/10 hover:border-red-400/60"
                          }`}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={`${activeTab} thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[rgb(32,6,3)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Scrollable content */}
            <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2">
              {/* Title */}
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  {item?.title || "Transformation"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-300 italic">
                  {item?.propertyType || item?.service || "Project"}
                </p>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10 text-xs sm:text-sm">
                <Meta label="Location" value={item?.location} />
                <Meta label="Area (sqft)" value={item?.areaSqft} />
                <Meta
                  label="Timeline"
                  value={`${formatDate(item?.timeline?.startDate)} — ${formatDate(item?.timeline?.endDate)}`}
                />
                <Meta
                  label="Duration"
                  value={
                    item?.timeline?.durationWeeks
                      ? `${item.timeline.durationWeeks} weeks`
                      : "—"
                  }
                />
                <Meta
                  label="Rating"
                  value={item?.rating ? `⭐ ${item.rating} / 5` : "—"}
                />
                <div className="col-span-2">
                  <p className="text-[10px] sm:text-xs text-gray-400">Services</p>
                  <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
                    {Array.isArray(item?.service) && item.service.length > 0
                      ? item.service.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                          >
                            {String(s).replace(/-/g, " ")}
                          </span>
                        ))
                      : typeof item?.service === "string"
                      ? (
                        <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                          {item.service}
                        </span>
                        )
                      : <span className="text-[10px] sm:text-sm">—</span>}
                  </div>
                </div>
              </div>

              {/* Challenge / Result */}
              {(item?.challenge || item?.result) && (
                <div className="rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10 space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  {item?.challenge && (
                    <Section title="Client's Challenge" text={item.challenge} />
                  )}
                  {item?.result && (
                    <Section title="Result" text={item.result} />
                  )}
                </div>
              )}

              {/* Testimonial */}
              {item?.testimonial?.quote && (
                <div className="rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10 text-xs sm:text-sm">
                  <blockquote className="text-white/90 leading-6 sm:leading-7">
                    “{item.testimonial.quote}”
                  </blockquote>
                  <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-white/70">
                    — {item.testimonial.author || "Client"}
                    {item.testimonial.role ? `, ${item.testimonial.role}` : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    // 3. TELL THE PORTAL WHERE TO RENDER
    document.getElementById('portal-root')
  );
}

// Helper components
function Meta({ label, value }) {
  return (
    <div>
      <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
      <p className="text-[11px] sm:text-sm">{value || "—"}</p>
    </div>
  );
}
function Section({ title, text }) {
  return (
    <div>
      <h3 className="text-sm sm:text-lg font-semibold text-[#f7e7ce]">{title}</h3>
      <p className="mt-1 sm:mt-2 text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}