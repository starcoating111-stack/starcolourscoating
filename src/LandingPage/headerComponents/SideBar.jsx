// Sidebar.jsx
import React, { useState } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  navLinks = [],
  staticLinks = [],
  dropdownContent = {},
}) {
  const navigate = useNavigate();

  // Combine links for mobile
  const mobileLinks = [...staticLinks.slice(0, 1), ...navLinks, ...staticLinks.slice(1)];

  // Combine links for desktop (md+)
  const desktopLinks = staticLinks;

  const [openGroup, setOpenGroup] = useState(null);
  const toggleGroup = (label) => setOpenGroup((prev) => (prev === label ? null : label));

  const handlePrimaryClick = (label) => {
    const hasItems = Array.isArray(dropdownContent[label]) && dropdownContent[label].length > 0;
    if (hasItems) {
      toggleGroup(label);
      return;
    }
    if (label === "Portfolio") {
      navigate("/portfolio-page");
      setSidebarOpen(false);
    } else if (label === "Home") {
      navigate("/");
      setSidebarOpen(false);
    } else if (label === "About Us") {
      navigate("/about");
      setSidebarOpen(false);
    } else if (label === "FAQs") {
      navigate("/faqs");
      setSidebarOpen(false);
    }
  };

  const renderLinks = (linksArray) =>
    linksArray.map((label) => {
      const items = dropdownContent[label] || null;
      const isExpandable = Array.isArray(items) && items.length > 0;
      const open = openGroup === label;

      return (
        <li key={label} className="border-b border-white/10">
          <button
            className="w-full flex items-center justify-between py-3 font-semibold text-sm hover:text-red-600 text-left"
            onClick={() => handlePrimaryClick(label)}
            aria-expanded={open}
            aria-controls={`submenu-${label}`}
          >
            <span>{label}</span>
            {isExpandable && (
              <ChevronDownIcon
                className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {isExpandable && open && (
            <ul id={`submenu-${label}`} className="pb-2">
              {items.map(({ label: subLabel, href, download }) => (
                <li key={subLabel}>
                  {download ? (
                    <a
                      href={href}
                      download="Star-Colours-Coating-Brochure.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="block py-2 pl-4 text-sm text-white/80 hover:text-red-500"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {subLabel}
                    </a>
                  ) : href?.startsWith("/") ? (
                    <Link
                      to={href}
                      className="block py-2 pl-4 text-sm text-white/80 hover:text-red-500"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {subLabel}
                    </Link>
                  ) : (
                    <a
                      href={href || "#"}
                      className="block py-2 pl-4 text-sm text-white/80 hover:text-red-500"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {subLabel}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[70] bg-black bg-opacity-40 transition-opacity duration-300 mt-[72px] ${
          sidebarOpen ? "opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-[100] h-screen w-80 max-w-full bg-black/60 backdrop-blur-md border-b border-gray-700 text-white shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "0 0 20px rgba(0,0,0,0.18)" }}
        inert={!sidebarOpen ? "true" : undefined}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="hover:text-red-600 transition cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="px-6">
          {/* Render mobile links */}
          <div className="md:hidden">{renderLinks(mobileLinks)}</div>

          {/* Render desktop-only links */}
          <div className="hidden md:block">{renderLinks(desktopLinks)}</div>
        </ul>
      </aside>
    </>
  );
}