import { Mail, MapPin, FileDown, MessageCircle, PhoneCall } from "lucide-react";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import Footer from "../LandingPage/Footer";
import HeaderContainer from "../LandingPage/headerComponents/HeaderContainer";
import { Link } from "react-router-dom";
import Parallax from "./Parallax";
import ContactCard from "../ContactCard";
import sanityClient from "../sanityClient";
import { useEffect, useState } from "react";
import getintouch from "../assets/getintouch_highres.png";
import PageLayout from "../PageLayout";

export default function GetInTouchPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "contactInfo"][0]{
          address,
          phone,
          whatsapp,
          email,
          facebook,
          linkedin,
          instagram,
          pdfFile{
            asset->{
              url
            }
          }
        }`
      )
      .then(setInfo)
      .catch(console.error);
  }, []);

  if (!info) return <div>Loading...</div>;

  const pdfUrl = info.pdfFile?.asset?.url;
  const whatsappNumber = info.whatsapp || "";
  const whatsappMessage = "Hello Star Colours Coating team, I visited your website and would like to connect regarding your services.";

  return (
    <PageLayout>
      <HeaderContainer />

      <main className="text-white">
        {/* HERO PARALLAX */}
        <Parallax
          backgroundUrl={getintouch}
          title="Get In Touch"
          subtitle="We’re here to help — reach out anytime"
          paddingTop="pt-[72px]"
        />


        {/* Contact Form Section */}
        <section className="py-16 px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl mx-auto rounded-lg shadow-lg p-6 sm:p-8">
            <div className="w-full flex flex-col items-center justify-center pt-8 pb-3 text-center">
              <span className="text-xs tracking-widest font-medium mb-2">
                CONTACT US
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
                We’re Here to Help
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium">
                Reach out via the form below or any of the contact methods listed.
              </h2>
              <div className="w-7 h-1 bg-red-500 rounded-full mt-2"></div>
            </div>

            <ContactCard />
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Address */}
          <div className="bg-white/5 rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition">
            <MapPin className="mx-auto mb-4 text-teal-600" size={32} />
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="break-words">{info.address}</p>
          </div>

          {/* Social */}
          <div className="bg-white/5 rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition">
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
              {info.instagram && (
                <a
                  href={info.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600 transition"
                  aria-label="Instagram"
                >
                  <Instagram size={32} />
                </a>
              )}
              {info.facebook && (
                <a
                  href={info.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition"
                  aria-label="Facebook"
                >
                  <Facebook size={32} />
                </a>
              )}
              {info.linkedin && (
                <a
                  href={info.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={32} />
                </a>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <p>Connect with us on social media</p>
          </div>

          {/* Email */}
          <div className="bg-white/5 rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition">
            <Mail className="mx-auto mb-4 text-teal-600" size={32} />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="break-words">{info.email}</p>
          </div>

          {/* PDF */}
          <div className="bg-white/5 rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition">
            <FileDown className="mx-auto mb-4 text-red-600" size={32} />
            <h3 className="text-lg font-semibold mb-2">Download Brochure</h3>
            <p className="mb-4">Get our company profile in PDF format.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={pdfUrl}
                download
                className="inline-block px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Download PDF
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                View
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp & Call Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} />
        </a>

        <a
          href={`tel:+${info.phone}`}
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
          aria-label="Call us"
        >
          <PhoneCall size={24} />
        </a>
      </div>

      <Footer />
    </PageLayout>
  );
}
