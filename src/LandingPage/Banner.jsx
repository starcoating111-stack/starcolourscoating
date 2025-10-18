import { Link } from "react-router-dom";
import banner from "../assets/banner.mp4";

export default function Banner() {
  const ctaText = "Let's Work Together";

  return (
    <section
      className="
        relative w-full isolate
        
        // --- Responsive Height ---
        // Base (Mobile): Shorter height
        h-[60vh] 
        // Medium (Tablet): Taller height
        md:h-[80vh] 
        // Large (Desktop): Full 100dvh as you had before
        lg:h-[100dvh] 
        
        // --- Responsive Margin-Top (to match header) ---
        // Base (Mobile):
        mt-[56px] 
        // Small (Tablet):
        sm:mt-[64px] 
        // Large (Desktop): 72px as you had before
        lg:mt-[72px]
      "
      // ↓ Lowered minHeight to not conflict with the new h-[60vh]
      style={{ minHeight: "400px" }}
      aria-label="Hero"
    >
      {/* Video Background */}
      <video
        src={banner}
        className="absolute w-full h-full object-cover -z-10"
        style={{ objectPosition: "center" }}
        autoPlay
        muted
        playsInline
      />

      {/* Overlay Gradients */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(32,6,3,0.25)] via-[rgba(32,6,3,0.1)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* CTA Button Container */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 z-10 w-full text-center px-4
          // ↓ Adjusted bottom position to look good on all screen heights
          bottom-[20%]
          md:bottom-[18%]
        "
      >
        <Link
          to="/getintouch"
          className="
            inline-flex items-center gap-x-2
            rounded-full font-semibold tracking-wide
            border border-white/50
            shadow-[0_10px_24px_rgba(0,0,0,0.35)]
            bg-white/10 backdrop-blur-sm
            hover:bg-[rgb(32,6,3)] hover:text-[#f7e7ce] hover:border-white/60
            transition-all duration-300
            // Responsive sizing and typography
            text-sm px-5 py-2.5 // Base size for mobile
            md:text-base md:px-8 md:py-3 // Larger for medium and up
          "
          aria-label={ctaText}
        >
          {ctaText}
          <span className="inline-block translate-y-[1px]" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}