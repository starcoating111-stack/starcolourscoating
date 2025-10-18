import { useEffect, useState, useMemo } from "react";
import sanityClient from "../sanityClient";
import imageUrlBuilder from "@sanity/image-url";
import { motion } from "framer-motion";

// === Sanity Image Builder ===
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source) => builder.image(source).auto("format").fit("max").url();

const FounderSection = () => {
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    subSubheader: "",
    founders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === Combined Query ===
  useEffect(() => {
    const query = `{
      "sectionTitle": *[_type == "titleSection" && section == "foundership"][0]{title, subtitle, subSubheader},
      "about": *[_type == "aboutSection"][0]{
        founder{name, role, bio, image, linkedin, instagram, email},
        coFounder{name, role, bio, image, linkedin, instagram, email}
      }
    }`;
    setLoading(true);
    sanityClient
      .fetch(query)
      .then(({ sectionTitle, about }) => {
        const founders = about
          ? [about.founder, about.coFounder].filter(Boolean)
          : [];
        setData({
          title: sectionTitle?.title || "",
          subtitle: sectionTitle?.subtitle || "",
          subSubheader: sectionTitle?.subSubheader || "",
          founders,
        });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const { title, subtitle, subSubheader, founders } = data;

  // === Pre-generate URLs ===
  const foundersWithImg = useMemo(() => {
    return founders.map((person) => ({
      ...person,
      imageUrl: person.image ? urlFor(person.image) : null,
    }));
  }, [founders]);

  return (
    <section className="py-16 px-6 sm:px-10 bg-black/40 text-gray-100 border-t border-white/10">
      {/* === Header === */}
      <div className="text-center mb-12">
        {title && (
          <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#f7e7ce]/80 block mb-2">
            {title}
          </span>
        )}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold font-serif text-[#f7e7ce]"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        {subSubheader && (
          <p className="text-gray-400 italic mt-3 text-sm sm:text-base max-w-2xl mx-auto">
            {subSubheader}
          </p>
        )}
        <div className="w-10 h-1 bg-gradient-to-r from-[#f7e7ce] via-[#ffdfb3] to-[#f7e7ce] rounded-full mt-5 mx-auto" />
      </div>

      {/* === States === */}
      {loading && (
        <div className="flex justify-center gap-10 animate-pulse">
          {Array(2)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-700/40 border border-gray-600"
              />
            ))}
        </div>
      )}

      {error && (
        <p className="text-center text-red-400">
          Failed to load founder section 😔
        </p>
      )}

      {/* === Founders Centered === */}
      {!loading && !error && foundersWithImg.length > 0 && (
        <div
          className="
            flex flex-col sm:flex-row justify-center items-center 
            gap-10 sm:gap-16 mt-10 flex-wrap text-center
          "
        >
          {foundersWithImg.map((person, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              {/* === Image === */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="relative"
              >
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover mx-auto shadow-lg border-4 border-[#f7e7ce]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 rounded-full border border-[#f7e7ce]/30 blur-sm" />
              </motion.div>

              {/* === Name + Role === */}
              <h3 className="mt-4 text-lg sm:text-xl font-semibold text-[#f7e7ce] font-serif">
                {person.name}
              </h3>
              <p className="text-gray-400 italic text-sm">{person.role}</p>

              {/* === Socials === */}
              <div className="flex justify-center gap-4 mt-3">
                {person.linkedin && (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-[#f7e7ce] transition-colors"
                  >
                    <i className="fab fa-linkedin text-lg"></i>
                  </a>
                )}
                {person.instagram && (
                  <a
                    href={person.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-[#f7e7ce] transition-colors"
                  >
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                )}
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="text-gray-400 hover:text-[#f7e7ce] transition-colors"
                  >
                    <i className="fas fa-envelope text-lg"></i>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FounderSection;
