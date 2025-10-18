import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import HeaderContainer from "../LandingPage/headerComponents/HeaderContainer";
import Footer from "../LandingPage/Footer";
import Parallax from "./Parallax";
import portfolio from "../assets/portfolio.png";
import PageLayout from "../PageLayout";

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source).auto("format");

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImagesIndexes, setSelectedImagesIndexes] = useState({});

  useEffect(() => {
    const query = `*[_type == "portfolio"] | order(_createdAt desc){
      title,
      slug,
      coverImage{..., asset->},
      gallery[]{..., asset->},
      type,
      description,
      location,
      completionDate,
      clientName,
      service
    }`;
    sanityClient
      .fetch(query)
      .then((data) => {
        setPortfolioItems(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading portfolio:", err);
        setLoading(false);
      });
  }, []);

  const getMedia = (item) => {
    const cover = item.coverImage ? [item.coverImage] : [];
    const gal = Array.isArray(item.gallery) ? item.gallery.filter(Boolean) : [];
    return [...cover, ...gal];
  };

  const handleSelectImage = (slug, index) => {
    setSelectedImagesIndexes((prev) => ({ ...prev, [slug]: index }));
  };

  return (
    <PageLayout>
      <HeaderContainer />

      <main className="min-h-screen flex flex-col">
        <Parallax
          backgroundUrl={portfolio}
          paddingTop="pt-[72px]"
        />

        <section className="flex-grow px-4 sm:px-20 py-12 space-y-20">
          {loading ? (
            <p className="text-center text-white/70">Loading...</p>
          ) : portfolioItems.length === 0 ? (
            <p className="text-center text-white/70">No portfolio items found.</p>
          ) : (
            portfolioItems.map((item, index) => {
              const mediaItems = getMedia(item);
              const selectedIdx = selectedImagesIndexes[item.slug.current] || 0;
              const selectedMedia = mediaItems[selectedIdx];

              return (
                <article key={item.slug.current} className="max-w-[1200px] mx-auto text-gray-100 rounded-2xl p-6 sm:p-8">
                  <header className="mb-6">
                    <h2 className="text-3xl font-extrabold">{item.title}</h2>
                    <p className="text-gray-400 italic mt-1">{item.type || "Project"}</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-6 flex flex-col rounded-xl overflow-hidden bg-white/10 border border-white/20 min-h-0">
                      
                  <div className="flex-1 flex items-center justify-center min-h-[300px] max-h-[500px] w-full bg-black/20 rounded-xl overflow-hidden">
                    {!selectedMedia ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No media available
                      </div>
                    ) : (() => {
                        const isVideo = selectedMedia.asset?.mimeType?.startsWith("video/");
                        if (isVideo) {
                          return (
                            <video
                              key={selectedMedia.asset._id}
                              src={selectedMedia.asset.url}
                              className="max-w-full max-h-full object-contain"
                              controls
                              autoPlay
                              muted
                              loop
                            />
                          );
                        }

                        const mainSrc = urlFor(selectedMedia)
                          ?.width(1400)
                          .height(1000)
                          .fit("crop")
                          .quality(85)
                          .url();

                        return (
                          <img
                            src={mainSrc}
                            alt={selectedMedia?.alt || item.title || "Project image"}
                            className="max-w-full max-h-full object-contain"
                          />
                        );
                    })()}
                  </div>

                      
                      {mediaItems.length > 1 && (
                        <nav className="px-4 py-3 bg-white/10 border-t border-white/20 overflow-x-auto no-scrollbar flex gap-3">
                          {mediaItems.map((media, i) => {
                            const isActive = i === selectedIdx;
                            const isVideoThumb = media.asset?.mimeType?.startsWith("video/");
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelectImage(item.slug.current, i)}
                                className={`flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden border transition 
                                  ${isActive ? "border-red-500 ring-2 ring-red-500/40" : "border-white/20 hover:border-red-400/60"}`}
                                aria-label={`Select media ${i + 1} for ${item.title}`}
                                type="button"
                              >
                                {isVideoThumb ? (
                                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white/50" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                ) : (
                                  (() => {
                                    const thumbSrc = urlFor(media)?.width(240).height(180).fit("crop").url();
                                    return thumbSrc ? (
                                      <img
                                        src={thumbSrc}
                                        alt={media.alt || `Thumbnail ${i + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-black/20" />
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
                        </nav>
                      )}
                    </div>
                    
                    <div className="lg:col-span-6 flex flex-col gap-6 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-6 rounded-xl p-5 bg-white/10 border border-white/20 text-sm">
                        <div>
                          <dt className="text-gray-400 text-xs uppercase">Location</dt>
                          <dd className="mt-1">{item.location || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 text-xs uppercase">Completed</dt>
                          <dd className="mt-1">{formatDate(item.completionDate) || "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 text-xs uppercase">Client</dt>
                          <dd className="mt-1">{item.clientName || "—"}</dd>
                        </div>
                        <div className="col-span-2">
                          <dt className="text-gray-400 text-xs uppercase">Services</dt>
                          <dd className="mt-1 flex flex-wrap gap-2">
                            {Array.isArray(item.service) && item.service.length > 0
                              ? item.service.map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-3 py-1 rounded-full bg-white/20 border border-white/20"
                                  >
                                    {String(s).replace(/-/g, " ")}
                                  </span>
                                ))
                              : "—"}
                          </dd>
                        </div>
                      </div>

                      {item.description && (
                        <section className="rounded-xl p-5 bg-white/10 border border-white/20 text-gray-200 leading-relaxed text-sm">
                          <p>{item.description}</p>
                        </section>
                      )}

                      <div className="mt-auto flex justify-end">
                        <a
                          href="/getintouch"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-900 transition text-white font-semibold"
                        >
                          Get Started
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {index < portfolioItems.length - 1 && (
                    <hr
                      className="border-t border-gray-600 my-12 mx-auto w-[calc(100%-80px)]"
                      style={{ borderStyle: "solid" }}
                    />
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>

      <Footer />
    </PageLayout>
  );
}