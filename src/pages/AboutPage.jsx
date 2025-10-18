// src/components/AboutPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import HeaderContainer from "../LandingPage/headerComponents/HeaderContainer";
import Footer from "../LandingPage/Footer";
import { Link } from "react-router-dom";
import Parallax from "./Parallax";
import about from "../assets/about.png";
import PageLayout from "../PageLayout";
import { ParallaxProvider, Parallax as ScrollParallax } from "react-scroll-parallax";

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source).auto("format");
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "aboutSection"][0]{
          title,
          subtitle,
          about,
          bannerImage,
          certificateImage,
          stats,
          values,
          founder{name,role,bio,image,linkedin,instagram,email},
          coFounder{name,role,bio,image,linkedin,instagram,email}
        }`
      )
      .then(setAboutData)
      .catch(console.error);
  }, []);

  const certificateUrl = useMemo(
    () =>
      aboutData?.certificateImage
        ? urlFor(aboutData.certificateImage).url()
        : null,
    [aboutData?.certificateImage]
  );

  if (!aboutData) return null;

  return (
    <PageLayout>
      <HeaderContainer />

      <main className="text-white">
        {/* HERO */}
        <Parallax backgroundUrl={about} paddingTop="pt-[72px]" />


        {/* ABOUT CONTENT */}
        <section className="px-6 sm:px-20 py-12">
          <div className="grid gap-10 lg:grid-cols-2 max-w-6xl mx-auto items-start">
            {/* Rich text */}
            <div>
              {aboutData.about?.map(
                (block, idx) =>
                  block._type === "block" && (
                    <p
                      key={idx}
                      className="text-white/85 leading-relaxed mb-4 text-base sm:text-lg"
                    >
                      {block.children?.map((c) => c.text).join(" ")}
                    </p>
                  )
              )}
            </div>

            {/* Certificate with Parallax */}
            <aside className="relative rounded-2xl overflow-hidden border border-white/10">
              <ParallaxProvider>
                {certificateUrl ? (
                  <ScrollParallax speed={-10}>
                    <img
                      src={certificateUrl}
                      alt="Certificate"
                      className="w-full h-[300px] sm:h-[400px] md:h-[480px] object-cover"
                      loading="lazy"
                    />
                  </ScrollParallax>
                ) : (
                  <div className="w-full h-[360px] bg-white/5 flex items-center justify-center">
                    <span className="text-white/60 italic">
                      No certificate image
                    </span>
                  </div>
                )}
              </ParallaxProvider>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </aside>
          </div>
        </section>

        {/* STATS */}
        {aboutData.stats?.length > 0 && (
          <section className="px-6 sm:px-20 pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {aboutData.stats.map((s, i) => (
                <Stat key={i} label={s.label} value={s.value} />
              ))}
            </div>
          </section>
        )}

        {/* VALUES */}
        {aboutData.values?.length > 0 && (
          <section className="px-6 sm:px-20 py-14">
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aboutData.values.map((v, i) => (
                <ValueCard key={i} title={v.title} text={v.description} />
              ))}
            </div>
          </section>
        )}

        {/* LEADERSHIP */}
        <section className="px-6 sm:px-20 pb-24">
          <div className="max-w-6xl mx-auto space-y-16">
            {aboutData.founder && (
              <PersonRow side="right" person={aboutData.founder} />
            )}
            {aboutData.coFounder && (
              <PersonRow side="left" person={aboutData.coFounder} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </PageLayout>
  );
}

function PersonRow({ side = "right", person }) {
  const imageUrl = person?.image ? urlFor(person.image) : null;

  const ImageBlock = (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg mx-auto">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={person?.name}
          className="w-full object-cover aspect-[3/4]"
          loading="lazy"
        />
      ) : (
        <div className="w-full aspect-[3/4] bg-white/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col justify-center">
      <h3 className="text-2xl sm:text-3xl font-semibold" style={{ color: "#f7e7ce" }}>
        {person?.name}
      </h3>
      {person?.role && <p className="text-sm sm:text-base text-white/70 mt-1">{person.role}</p>}

      {/* Short bio from Sanity schema */}
      {person?.bio && <p className="mt-5 text-white/85 leading-relaxed">{person.bio}</p>}
    </div>
  );

  return (
    <div
      className={`grid gap-8 items-center ${
        side === "right" ? "lg:grid-cols-[1fr_360px]" : "lg:grid-cols-[360px_1fr]"
      }`}
    >
      {side === "right" ? (
        <>
          {TextBlock}
          {ImageBlock}
        </>
      ) : (
        <>
          {ImageBlock}
          {TextBlock}
        </>
      )}
    </div>
  );
}


/* Stat Card */
function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
      <div className="text-2xl font-semibold" style={{ color: "#f7e7ce" }}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-white/70 mt-1">
        {label}
      </div>
    </div>
  );
}

/* Value Card */
function ValueCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
      <h4 className="text-lg font-semibold" style={{ color: "#f7e7ce" }}>
        {title}
      </h4>
      <p className="mt-3 text-white/80 leading-relaxed text-sm sm:text-base">
        {text}
      </p>
    </div>
  );
}
