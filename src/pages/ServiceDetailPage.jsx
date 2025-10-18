import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import HeaderContainer from "../LandingPage/headerComponents/HeaderContainer";
import Footer from "../LandingPage/Footer";
import Parallax from "./Parallax";
import PortfolioModal from "../modals/PortfolioModal";
import { FaInstagram } from "react-icons/fa";
import PageLayout from "../PageLayout"; // ✅ Use shared layout

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

const fallbackBanner =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
    const [instagram, setInstagram] = useState("");

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "contactInfo"][0]{ instagram }`)
      .then((data) => setInstagram(data?.instagram || ""))
      .catch(console.error);
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "service" && slug.current == $slug][0]{
          _id,
          title,
          bannerImage,
          tagline,
          slug,
          media{
            image,
            video{ asset->{ url } }
          },
          description
        }`,
        { slug }
      )
      .then((data) => {
        setService(data);
        if (data?.slug?.current) {
          sanityClient
            .fetch(
              `*[_type == "portfolio" && $serviceSlug in service]{
                title,
                slug,
                coverImage
              }`,
              { serviceSlug: data.slug.current }
            )
            .then((works) => setPortfolio(works));
        }
      })
      .catch(console.error);
  }, [slug]);




  const bannerImage = useMemo(
    () => (service?.media?.image ? urlFor(service.media.image).url() : null),
    [service?.media?.image]
  );

  const bannerUrl = useMemo(
    () => (service?.bannerImage ? urlFor(service.bannerImage).url() : null),
    [service?.bannerImage]
  );

  if (!service)
    return <div className="text-center py-20 text-white">Loading...</div>;

  const handleOpenModal = (slug) => {
    setSelectedSlug(slug);
    setOpen(true);
  };

  return (
    <PageLayout>
      <HeaderContainer />

      <main className="text-white flex flex-col">
        {/* Hero */}
        <Parallax backgroundUrl={bannerUrl || fallbackBanner} paddingTop="pt-[72px]" />

        <section className="flex-grow px-6 sm:px-20 py-12">
          {/* Tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {["description", "previousWorks"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#f7e7ce] text-black"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {tab === "description" ? "Description" : "Previous Works"}
                </button>
              ))}
            </div>

            {/* Description tab */}
            {activeTab === "description" && (
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                <div className="rounded-2xl overflow-hidden flex justify-center">
                  {service.media?.video?.asset?.url ? (
                    <video
                      src={service.media.video.asset.url}
                      className="w-full max-w-md h-auto object-contain scale-90"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={bannerImage}
                      alt={service.title}
                      className="w-full max-w-md h-auto object-contain scale-90"
                    />
                  )}
                </div>
                <div>
                  {service.description?.map((block, idx) => (
                    <p
                      key={idx}
                      className="text-white/85 leading-relaxed mb-6 text-lg"
                    >
                      {block.children?.map((c) => c.text).join(" ")}
                    </p>
                  ))}

<div className="inline-flex items-center gap-3
                px-4 py-3
                text-sm sm:text-base font-semibold tracking-wide
                w-fit-content max-w-md
                border border-white/20
                shadow-[0_8px_20px_rgba(0,0,0,0.25)]
                rounded-md
                bg-gradient-to-r from-white/10 via-white/5 to-white/10
                backdrop-blur-lg
                hover:from-white/20 hover:via-white/10 hover:to-white/20
                transition-all duration-300">
  
  <span className="text-white/80 font-medium text-lg">
    For more, connect us on
  </span>
  <span className="text-white/30 mx-1">|</span>

  {instagram && (
    <a
      href={instagram}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center 
                           transition-all duration-300"
    >
      <FaInstagram className="text-3xl text-white/80" />
    </a>
  )}
</div>



                </div>
              </div>
            )}

            {/* Previous Works tab */}
            {activeTab === "previousWorks" && (
              <div className="w-full max-w-6xl mx-auto">
                {/* Horizontal scroll for smaller screens */}
                <div className="block xl:hidden">
                  <div
                    className="overflow-x-auto scrollbar-hide -mx-4 px-4"
                    style={{ overflowY: "hidden", paddingBottom: "6px" }}
                  >
                    <div className="flex gap-4 sm:gap-6 pb-2">
                      {portfolio.map((work, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpenModal(work.slug.current)}
                          className="relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden group hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e7ce]"
                          style={{
                            width: "80vw",
                            maxWidth: "420px",
                            height: "70vw",
                            maxHeight: "520px",
                            aspectRatio: "10/12",
                          }}
                          aria-label={`Open ${work.title}`}
                        >
                          <img
                            src={urlFor(work.coverImage).width(1000).height(1300).fit("crop").url()}
                            alt={work.coverImage?.alt || work.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 bg-[rgba(135,206,235,0.55)]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.35)] via-transparent to-transparent" />
                          </div>
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                              <h3 className="text-lg sm:text-xl font-semibold text-black drop-shadow">{work.title}</h3>
                              {work.type ? (
                                <p className="mt-1 text-xs sm:text-sm font-medium text-black/85">
                                  {work.type}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop: grid view */}
                <div className="hidden xl:block">
                  <div className="grid grid-cols-3 gap-6">
                    {portfolio.map((work, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOpenModal(work.slug.current)}
                        className="relative rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7e7ce]"
                        style={{ height: "420px" }}
                        aria-label={`Open ${work.title}`}
                      >
                        <img
                          src={urlFor(work.coverImage).width(1200).height(900).fit("crop").url()}
                          alt={work.coverImage?.alt || work.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-[rgba(135,206,235,0.55)]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.35)] via-transparent to-transparent" />
                        </div>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                            <h3 className="text-2xl font-semibold text-black drop-shadow">{work.title}</h3>
                            {work.type ? (
                              <p className="mt-1 text-sm font-medium text-black/85">{work.type}</p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hide Scrollbar CSS */}
                <style>{`
                  .scrollbar-hide::-webkit-scrollbar { display: none; }
                  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>

      {/* Modal mount */}
      <PortfolioModal
        slug={selectedSlug}
        open={open}
        onClose={() => setOpen(false)}
      />
    </PageLayout>
  );
}
