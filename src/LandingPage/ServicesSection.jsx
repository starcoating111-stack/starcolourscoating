import { useEffect, useMemo, useRef, useState } from "react";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source).auto("format");

export default function ServicesInfiniteStrip() {
  const [services, setServices] = useState([]);
  const [paused, setPaused] = useState(false);
  const [sectionTitle, setSectionTitle] = useState({ title: "", subtitle: "" });

  // === Fetch title ===
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "titleSection" && section == "services"]{title, subtitle}`
      )
      .then((data) => {
        if (data?.length > 0) setSectionTitle(data[0]);
      })
      .catch(console.error);
  }, []);

  // === Fetch services ===
  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "service"] | order(_createdAt asc){
          _id,
          title,
          slug,
          media{
            image{asset->{_id,url}},
            video{asset->{_id,url}}
          }
        }`
      )
      .then(setServices)
      .catch(console.error);
  }, []);

  // === Process items ===
  const items = useMemo(() => {
    return services.map((s) => {
      const videoUrl = s.media?.video?.asset?.url;
      const imageAsset = s.media?.image?.asset;
      const isVideo = Boolean(videoUrl);

      return {
        id: s._id,
        title: s.title || "Untitled Service",
        href: s.slug?.current ? `/services/${s.slug.current}` : "#",
        type: isVideo ? "video" : "image",
        src: isVideo
          ? videoUrl
          : imageAsset
          ? urlFor(imageAsset).width(1200).url()
          : "/fallback.jpg",
        poster: isVideo && imageAsset ? urlFor(imageAsset).width(800).url() : undefined,
      };
    });
  }, [services]);

  // === Duplicate for infinite scroll ===
  const loopItems = useMemo(() => [...items, ...items], [items]);

  // === Pause on hover/touch ===
  const handlePointerEnter = () => setPaused(true);
  const handlePointerLeave = () => setPaused(false);

  return (
    <section
      className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-10 xl:px-20 text-gray-100 overflow-hidden"
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointerEnter}
      onTouchEnd={handlePointerLeave}
    >
      {/* === Keyframes === */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* === Section Header === */}
      <div className="text-center mb-12">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase"
          style={{ color: "#f7e7ce" }}
        >
          {sectionTitle.title}
        </h2>
        {sectionTitle.subtitle && (
          <p className="mt-3 text-sm sm:text-base md:text-lg text-[#f7e7ce]/80 max-w-2xl mx-auto">
            {sectionTitle.subtitle}
          </p>
        )}
        <div className="w-24 sm:w-28 h-1 mx-auto mt-5 bg-gradient-to-r from-[#f7e7ce] via-[#ffdfb3] to-[#f7e7ce] rounded-full animate-pulse" />
      </div>

      {/* === Infinite Marquee === */}
      <div className="overflow-hidden">
        <div
          className="inline-flex items-center gap-6 sm:gap-8 will-change-transform"
          style={{
            animationName: items.length ? "marqueeScroll" : "none",
            animationDuration:
              window.innerWidth < 640
                ? "40s"
                : window.innerWidth < 1024
                ? "32s"
                : "26s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loopItems.map((item, i) => (
            <StripCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StripCard({ item }) {
  const videoRef = useRef(null);
  const isVideo = item.type === "video";

  const playOnHover = async () => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.currentTime = 0;
      try {
        await v.play();
      } catch (err) {
        if (err.name !== "AbortError") console.warn(err);
      }
    }
  };

  const pauseOnLeave = () => {
    if (isVideo && videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }
  };

  return (
    <Link
      to={item.href}
      className="group relative block select-none"
      aria-label={`View ${item.title}`}
    >
      <div className="w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px] aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-[rgb(25,5,3)] shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Media */}
        {isVideo ? (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted
            playsInline
            preload="metadata"
            loading="lazy"
            onMouseEnter={playOnHover}
            onMouseLeave={pauseOnLeave}
            onTouchStart={playOnHover}
            onTouchEnd={pauseOnLeave}
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Overlay */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[rgba(32,6,3,0.95)] via-[rgba(32,6,3,0.6)] to-transparent p-2">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center text-[#f7e7ce] break-words">
            {item.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
