// DropdownMenu.jsx
export default function DropdownMenu({ dropdownRef, content, onClose }) {
  return (
    <div
      ref={dropdownRef}
      className="fixed left-0 w-full z-[99] bg-black/60 backdrop-blur-md border-b border-gray-700 dropdown-animate"
      style={{ top: "72px" }}
      onMouseLeave={onClose}
    >
      {/* ↓ Adjusted padding for better responsiveness */}
      <div className="max-w-screen-2xl mx-auto px-4 py-6 sm:px-6">
        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3 lg:grid-cols-4">
          {content.map(({ label, href, download }) => (
            <a
              key={label}
              href={href}
              {...(download ? { download: "Star-Colours-Coating-Brochure.pdf" } : {})}
              // ↓ Made text smaller on tablets (md)
              className="py-2 px-1 text-sm md:text-base text-white hover:text-red-400 font-medium transition-colors"
              target={download ? "_blank" : undefined}
              rel={download ? "noreferrer" : undefined}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}