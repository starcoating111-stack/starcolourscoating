import React from "react";
import ContactCard from "../ContactCard";

export default function ContactUs() {
  return (
    <section className="w-full py-10 px-8  text-gray-100">
{/* Header */}
<div className="text-center mb-10">
  <h2
    className="text-2xl sm:text-3xl font-bold tracking-tight uppercase"
    style={{ color: "#f7e7ce" }}
  >
    Get in Touch
  </h2>
  <p className="mt-3 text-base sm:text-lg text-[#f7e7ce]/80 max-w-xl mx-auto">
Experience the art of flawless finishing. Reach out to Star Colours Coating — where precision meets perfection!  </p>
  <div
    className="w-28 h-1 mx-auto mt-5 bg-gradient-to-r from-[#f7e7ce] via-[#ffdfb3] to-[#f7e7ce] rounded-full animate-pulse"
  />
</div>


      {/* Contact Form Section */}
      <ContactCard />
    </section>
  );
}
