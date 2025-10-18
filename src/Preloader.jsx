// src/components/Preloader.jsx
import logo from "./assets/star-logo.png";

export default function Preloader({ fadeOut }) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[9999] bg-[rgb(32,6,3)] transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-40 h-40 overflow-hidden">
        {/* Logo with spray reveal */}
        <img
          src={logo}
          alt="Loading..."
          className="w-full h-full object-contain animate-spray-reveal"
        />
      </div>
    </div>
  );
}
