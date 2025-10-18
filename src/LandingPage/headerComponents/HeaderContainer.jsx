import React, { useState, useRef, useEffect } from "react";
import sanityClient from "../../sanityClient";
import MenuBar from "./MenuBar";
import DropdownMenu from "./DropdownMenu";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
// REMOVED: Local brochure import is no longer needed
// import brochure from "../../assets/STAR COLOURS COATING- {WELCOME LETTER}.pdf";

// REMOVED: This constant is now dynamic
// const pdfUrl = brochure;

const NAV_LINKS = ["Our Services", "Experience", "Portfolio"];
const STATIC_LINKS = ["Home", "About Us", "FAQs"];

export default function HeaderContainer() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const navRef = useRef();
  const dropdownRef = useRef();

  // MODIFIED: The brochure link is now removed from the initial state
  // It will be added dynamically after being fetched from Sanity.
  const [dropdownContent, setDropdownContent] = useState({
    "Our Services": [],
    "Experience": [
      { label: "Our Legacy", href: "/about" },
      // "Why Choose Star Colours Coating" link will be added here
    ],
  });

  useEffect(() => {
    // MODIFIED: Combined GROQ query to fetch both services and the PDF file URL
    // This is more efficient as it only makes one network request.
    const query = `{
      "services": *[_type == "service"] | order(_createdAt asc){_id, title, slug},
      "contactInfo": *[_type == "contactInfo"][0]{ 
        "brochureUrl": pdfFile.asset->url 
      }
    }`;

    sanityClient
      .fetch(query)
      .then((data) => {
        // 1. Get service links (same as before)
        const serviceLinks = data.services.map((svc) => ({
          label: svc.title,
          href: svc.slug?.current ? `/services/${svc.slug.current}` : "#",
        }));

        // 2. Get the fetched brochure URL
        const fetchedBrochureUrl = data.contactInfo?.brochureUrl;

        // 3. Create the brochure link object *if* the URL exists
        const brochureLink = fetchedBrochureUrl
          ? {
              label: "Why Choose Star Colours Coating",
              href: fetchedBrochureUrl,
              download: true, // This attribute prompts the user to download the file
            }
          : null;

        // 4. Update the dropdown content state
        setDropdownContent((prev) => ({
          ...prev,
          "Our Services": serviceLinks,
          "Experience": [
            { label: "Our Legacy", href: "/about" },
            // Conditionally add the brochure link to the array
            // If brochureLink is null (not found), it will be skipped
            ...(brochureLink ? [brochureLink] : []),
          ],
        }));
      })
      .catch(console.error);
  }, []);

  const handleNavClick = (menu) => {
    if (activeDropdown === menu) {
      setDropdownOpen(false);
      setTimeout(() => setActiveDropdown(null), 200);
    } else if (dropdownContent[menu]) {
      setActiveDropdown(menu);
      setDropdownOpen(true);
    }
  };

  // ... (rest of your component remains unchanged) ...

  useEffect(() => {
    function handleClick(event) {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setTimeout(() => setActiveDropdown(null), 200);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    const onClose = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    if (sidebarOpen) window.addEventListener("keydown", onClose);
    return () => window.removeEventListener("keydown", onClose);
  }, [sidebarOpen]);

  useEffect(() => {
    const threshold = 8;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const goingDown = currentY > lastScrollY.current + threshold;
          const goingUp = currentY < lastScrollY.current - threshold;

          if (currentY < 80) setHiddenOnScroll(false);
          else {
            if (goingDown) setHiddenOnScroll(true);
            else if (goingUp) setHiddenOnScroll(false);
          }

          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 w-full z-[100] bg-black/90 backdrop-blur-md text-white shadow-lg header-fill-in transform-gpu transition-all duration-300 ease-out`}
        animate={{
          y: hiddenOnScroll ? "-100%" : 0,
          opacity: hiddenOnScroll ? 0 : 1,
        }}
      >
        <MenuBar
          navRef={navRef}
          navLinks={NAV_LINKS}
          activeDropdown={activeDropdown}
          dropdownOpen={dropdownOpen}
          onNavClick={handleNavClick}
          setSidebarOpen={setSidebarOpen}
        />
      </motion.header>

      {/* Desktop dropdown */}
      {dropdownOpen && activeDropdown && dropdownContent[activeDropdown] && (
        <div className="hidden md:block">
          <DropdownMenu
            dropdownRef={dropdownRef}
            content={dropdownContent[activeDropdown]}
            onClose={() => {
              setDropdownOpen(false);
              setTimeout(() => setActiveDropdown(null), 200);
            }}
            neon
          />
        </div>
      )}

      {/* Sidebar for mobile */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navLinks={NAV_LINKS}
        staticLinks={STATIC_LINKS}
        dropdownContent={dropdownContent}
      />
    </>
  );
}