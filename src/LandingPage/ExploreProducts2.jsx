import React, { useState, useEffect } from "react";

// Menu Data
const MENU = [
  {
    name: "Clear Finishes",
    sublinks: [
      {
        title: "Light Color Wood",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Dark Color Wood",
        img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Open Pore Effect",
        img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Hi-Gloss Mirror Finish",
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    name: "Coloured Finishes",
    sublinks: [
      {
        title: "Light Shades",
        img: "https://images.unsplash.com/photo-1465101178521-c1a9136a0708?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Deep Colors",
        img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Soft Touch Finishes",
        img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    name: "Wood Stains",
    sublinks: [
      {
        title: "Natural Oak",
        img: "https://images.unsplash.com/photo-1465101178521-c1a9136a0708?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Teak Classic",
        img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
      },
      {
        title: "Grey Wash",
        img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
];

export default function ExploreProducts2() {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  // Track scroll direction + show bar logic
  useEffect(() => {
    const threshold = 200; // Show only after scrolling 200px

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine direction
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        if (currentScrollY > lastScrollY) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        setLastScrollY(currentScrollY);
      }

      // Show bar after threshold
      if (currentScrollY > threshold && scrollDirection === "down") {
        setShowBar(true);
      } else if (scrollDirection === "up") {
        setShowBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollDirection]);

  return (
    <>
      {/* Fixed Bottom Trigger Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full z-50 bg-black text-white 
          flex items-center justify-between h-12 px-4 border-t border-gray-800 
          transition-transform duration-300 ${
            showBar ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="text-xs font-semibold tracking-wide select-none">
            EXPLORE PRODUCTS BY USAGE
          </span>
          <svg
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 20 20"
            className="text-white"
          >
            <polyline
              points="5 12 10 7 15 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black bg-opacity-40 transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="fixed left-0 bottom-0 w-full z-[70] bg-white shadow-2xl rounded-t-2xl overflow-hidden border-t border-gray-300 animate-slideUpMenu">
            {/* Top bar */}
            <div className="flex justify-between items-center border-b px-5 py-3 bg-gray-100">
              <span className="font-semibold text-gray-800 text-lg">
                Explore Products
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-gray-800 hover:text-red-500"
              >
                <svg
                  width={28}
                  height={28}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content area */}
            <div className="flex h-[250px] md:h-[290px]">
              {/* Left menu */}
              <nav className="w-56 bg-gray-50 overflow-y-auto">
                {MENU.map((section, i) => (
                  <div
                    key={section.name}
                    onClick={() => setActiveIdx(i)}
                    className="group"
                  >
                    <div
                      className={`px-6 py-4 cursor-pointer text-[15px] font-semibold transition relative ${
                        activeIdx === i
                          ? "text-red-600"
                          : "text-gray-700 group-hover:text-black"
                      }`}
                    >
                      {section.name}
                      {activeIdx === i && (
                        <div className="absolute left-6 right-6 bottom-2 h-0.5 bg-red-600 rounded transition-all" />
                      )}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Right content */}
              <div className="flex-1 bg-white flex flex-col justify-center px-6">
                <div className="flex flex-row gap-7">
                  {MENU[activeIdx].sublinks.map((sublink) => (
                    <div
                      className="flex flex-col items-center min-w-[120px] group"
                      key={sublink.title}
                    >
                      <div className="h-20 w-28 flex items-center justify-center rounded-md border bg-gray-100 overflow-hidden mb-2">
                        <img
                          src={sublink.img}
                          alt={sublink.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[15px] text-gray-900 text-center font-medium whitespace-nowrap">
                        {sublink.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide up animation */}
          <style>{`
            .animate-slideUpMenu {
              animation: slideUpMenu .38s cubic-bezier(.4,0,.2,1);
            }
            @keyframes slideUpMenu {
              from { transform: translateY(100%);}
              to { transform: translateY(0);}
            }
          `}</style>
        </>
      )}
    </>
  );
}
