import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import bannerImage from "../assets/AboutSection.jpeg";

const AboutSection = () => {
  const [aboutData, setAboutData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "aboutSection"][0]{
          title,
          subtitle,
          about,
        }`
      )
      .then((data) => {
        setAboutData(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load About section data.");
      });
  }, []);

  if (error) {
    return (
      <section className="py-10 px-6 text-white" role="alert">
        <p className="text-center text-red-400">{error}</p>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section className="py-10 px-6 text-white flex justify-center items-center">
        <svg
          className="animate-spin h-8 w-8 text-[#f7e7ce]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </section>
    );
  }

  const { title, subtitle, about } = aboutData;

  return (
    <section id="about" className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-20 py-10 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          
          {/* Left: Parallax Banner */}
          <div className="relative col-span-1 lg:col-span-6 rounded-2xl overflow-hidden">
    <ParallaxProvider>
      <div className="relative col-span-1 lg:col-span-6 min-h-[420px] rounded-2xl overflow-hidden">
        <Parallax speed={-20}> 
          <img
            src={bannerImage}
            alt="About Banner"
            className="w-full h-full object-cover"
          />
        </Parallax>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/25 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none" />
      </div>
    </ParallaxProvider>

          </div>

          {/* Right: Content card */}
          <div className="col-span-1 lg:col-span-6 flex">
            <article className="relative w-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)] p-5 sm:p-6 md:p-8 flex flex-col">
              <div className="absolute left-0 top-5 sm:top-6 h-8 sm:h-10 w-1.5 bg-[#f7e7ce] rounded-r-md" />

              {title && (
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight pr-2 sm:pr-4"
                  style={{ color: "#f7e7ce" }}
                >
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="mt-2 sm:mt-3 text-base sm:text-lg text-white/85 italic">
                  {subtitle}
                </p>
              )}

              <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4">
                {Array.isArray(about) && about.length > 0 ? (
                  about.map((block, idx) => {
                    if (block?._type === "block" && Array.isArray(block.children)) {
                      const text = block.children.map((c) => c.text).join(" ");
                      if (!text.trim()) return null;
                      return (
                        <p
                          key={idx}
                          className="text-white/85 leading-relaxed text-[0.95rem] sm:text-base"
                        >
                          {text}
                        </p>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p className="text-white/70 leading-relaxed text-[0.95rem] sm:text-base">
                    No description available.
                  </p>
                )}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-10 bg-gradient-to-t from-black/10 to-transparent rounded-b-2xl" />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
