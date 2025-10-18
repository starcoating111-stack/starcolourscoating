import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from 'react-dom';
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";

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
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

export default function PortfolioModal({ slug, open, onClose }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!open || !slug) return;
    setLoading(true);
    sanityClient
      .fetch(
        `*[_type == "portfolio" && slug.current == $slug][0]{
          title, type, description, 
          coverImage{..., asset->{_id, url, mimeType}},
          gallery[]{..., asset->{_id, url, mimeType}},
          location, completionDate, clientName, service
        }`,
        { slug }
      )
      .then((data) => {
        setItem(data || null);
        setSelectedIdx(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, slug]);

  const mediaItems = useMemo(() => {
    if (!item) return [];
    const cover = item.coverImage ? [item.coverImage] : [];
    const gal = Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : [];
    return [...cover, ...gal];
  }, [item]);
  
  const selectedMedia = mediaItems[selectedIdx];

  // Other useEffects remain the same...
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
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 overflow-hidden flex-1 min-h-0">
            {/* Left side: Main media & thumbnails */}
            <div className="lg:col-span-6 flex flex-col h-[50vh] lg:h-full rounded-xl overflow-hidden bg-white/5 border border-white/10 min-h-0">
              
              {/* Media Display */}
              <div className="flex-1 bg-[rgb(32,6,3)] flex items-center justify-center min-h-0">
                {loading ? (
                  <div className="text-gray-300">Loading...</div>
                ) : !selectedMedia ? (
                  <div className="text-gray-400">No media</div>
                ) : (
                  (() => {
                    const isVideo = selectedMedia.asset?.mimeType?.startsWith("video/");
                    if (isVideo) {
                      return (
                        <video
                          key={selectedMedia.asset._id}
                          src={selectedMedia.asset.url}
                          className="w-full h-full object-contain"
                          controls
                          autoPlay
                          muted
                          loop
                        />
                      );
                    }
                    const mainSrc = urlFor(selectedMedia)?.width(1400).height(1000).fit("crop").quality(85).url();
                    return (
                      <img
                        src={mainSrc}
                        alt={selectedMedia?.alt || item?.title || "Project image"}
                        // ✨ THIS IS THE FIX ✨
                        className="w-full h-full object-contain"
                      />
                    );
                  })()
                )}
              </div>

              {/* Thumbnails */}
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border-t border-white/10">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
                  {mediaItems.map((media, idx) => {
                    const active = idx === selectedIdx;
                    const isVideoThumb = media.asset?.mimeType?.startsWith("video/");

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIdx(idx)}
                        className={`relative flex-shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden border transition ${
                          active
                            ? "border-red-500 ring-2 ring-red-500/40"
                            : "border-white/10 hover:border-red-400/60"
                        }`}
                      >
                        {isVideoThumb ? (
                          <div className="w-full h-full bg-black/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        ) : (
                          (() => {
                            const src = urlFor(media)?.width(200)?.height(140)?.fit("crop")?.url();
                            return src ? (
                              <img
                                src={src}
                                alt={media?.alt || `Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[rgb(32,6,3)]" />
                            );
                          })()
                        )}
                      </button>
                    );
                  })}
                  <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                  `}</style>
                </div>
              </div>
            </div>

            {/* Right side: Details */}
            <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-5 overflow-y-auto pr-1 sm:pr-2 min-h-0">
               {/* Title */}
               <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                    {item?.title || "Untitled Project"}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-300 italic">
                    {item?.type || "Project"}
                  </p>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10 text-xs sm:text-sm">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400">Location</p>
                    <p>{item?.location || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400">Completed</p>
                    <p>{formatDate(item?.completionDate) || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400">Client</p>
                    <p>{item?.clientName || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] sm:text-xs text-gray-400">Services</p>
                    <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
                      {Array.isArray(item?.service) && item.service.length > 0 ? (
                        item.service.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                          >
                            {String(s).replace(/-/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs sm:text-sm">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {item?.description && (
                  <div className="rounded-xl p-3 sm:p-4 bg-white/5 border border-white/10 text-xs sm:text-sm leading-relaxed">
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                )}

                {/* Spacer + CTA */}
                <div className="flex-1" />

                <div className="flex justify-end">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-red-600 hover:bg-red-900 transition text-white font-medium"
                  >
                    Get Started
                  </a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('portal-root')
  );
}