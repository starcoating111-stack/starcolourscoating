import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import sanityClient from "../sanityClient";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  const [info, setInfo] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "contactInfo"][0]{
        address, phone, email, facebook, instagram, linkedin
      }`)
      .then(setInfo)
      .catch(console.error);

    sanityClient
      .fetch(`*[_type == "service"] | order(_createdAt asc){ _id, title, slug }`)
      .then(setServices)
      .catch(console.error);
  }, []);

  if (!info) return null;

  return (
    <footer className="bg-gradient-to-b from-black/10 via-[#0a0a0a]/10 to-black/10 text-gray-200 pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,90,0.1),transparent_40%)] pointer-events-none"></div>

      <div className="relative w-[92%] sm:w-[86%] md:w-[84%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Logo + Vibe */}
        <div>
          <img src={logo} alt="Star Colours Coating" className="w-50 md:w-60 mb-4 drop-shadow-xl" />
          <p className="mb-6 text-sm  text-gray-300">
<b>"Crafting premium coatings that inspire elegance and perfection in every detail!"</b>          </p>
          <div className="flex space-x-4 text-2xl">
            {info.facebook && (
              <a href={info.facebook} target="_blank" rel="noreferrer" className="footer-social">
                <FaFacebookF />
              </a>
            )}
            {info.instagram && (
              <a href={info.instagram} target="_blank" rel="noreferrer" className="footer-social">
                <FaInstagram />
              </a>
            )}
            {info.linkedin && (
              <a href={info.linkedin} target="_blank" rel="noreferrer" className="footer-social">
                <FaLinkedinIn />
              </a>
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="footer-heading"><b>About Us!</b></h3>
          <br/>
          <p className="text-sm text-gray-300 leading-relaxed">
Star Colours Coating is dedicated to redefining the art of finishing. From wood to surface coatings, we bring together innovative techniques, premium materials, and skilled expertise to create finishes that are both timeless and durable. <br/>Our commitment is simple — to inspire trust, add value, and deliver perfection in every project."We take pride in transforming every surface into a statement of elegance and perfection!          </p>
        </div>

        {/* Services as tags */}
        <div>
          <h3 className="footer-heading"><b>Our Services!</b></h3>
          <br/>
          <div className="flex flex-wrap gap-2 mt-3">
            {services.slice(0, 7).map((s) => (
              <Link
                key={s._id}
                to={`/services/${s.slug.current}`}
                className="px-3 py-1 bg-white/10 text-xs rounded-full border border-white/20 hover:bg-red-500 hover:text-white transition"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-heading"><b>Let’s Talk!</b></h3>
          <br/>
          <p className="flex items-start gap-2 text-sm text-gray-300">
            <MapPin className="text-red-500 mt-1" /> {info.address}
          </p>
          <p className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <Phone className="text-red-500" /> {info.phone} / 98923 71686
          </p>
          <p className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <Mail className="text-red-500" /> {info.email}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 mt-12 pt-6 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Star Colours Coating • Finishing with Perfection! All rights reserved.
      </div>
    </footer>
  );
}

/* Tailwind extras (add in globals.css if needed) */
const styles = `
.footer-heading {
  @apply text-white text-lg font-semibold mb-4 relative inline-block;
}
.footer-heading::after {
  content: '';
  @apply absolute left-0 -bottom-1 w-8 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full;
}
.footer-social {
  @apply flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 transition hover:bg-red-500 hover:text-white;
}
`;
