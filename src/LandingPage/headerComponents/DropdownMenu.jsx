// DropdownMenu.jsx
import { Link } from "react-router-dom"; // 1. Link ko import karein

export default function DropdownMenu({ dropdownRef, content, onClose }) {
  return (
    <div
      ref={dropdownRef}
      className="fixed left-0 w-full z-[99] bg-black/60 backdrop-blur-md border-b border-gray-700 dropdown-animate"
      style={{ top: "72px" }}
      onMouseLeave={onClose}
    >
      <div className="max-w-screen-2xl mx-auto px-4 py-6 sm:px-6">
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
          {content.map(({ label, href, download }) =>
            // 3. Condition check: Agar download hai to 'a' tag, warna 'Link'
            download ? (
              <a
                key={label}
                href={href}
                download="Star-Colours-Coating-Brochure.pdf"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-1 text-sm md:text-base text-white hover:text-red-400 font-medium transition-colors"
              >
                {label}
              </a>
            ) : (
              <Link // 2. 'a' tag ki jagah 'Link' ka use karein
                key={label}
                to={href} // 'href' ki jagah 'to' prop ka use karein
                className="py-2 px-1 text-sm md:text-base text-white hover:text-red-400 font-medium transition-colors"
                onClick={onClose} // Optional: Link click par menu band karne ke liye
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}