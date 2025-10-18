import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function MenuBar({
  navRef,
  navLinks,
  activeDropdown,
  dropdownOpen,
  onNavClick,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 sm:px-5 py-2 bg-black/90 backdrop-blur-sm max-h-[76px]"
    >
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Star Colours Coating"
          className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
        />
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center ml-10">
        {navLinks.map((text, idx) => (
          <div className="relative flex items-center" key={text}>
            <button
              type="button"
              className={`font-helvetica-neue font-bold text-xs lg:text-[13px] tracking-widest uppercase px-4 py-2 cursor-pointer transition-colors duration-300 ${
                dropdownOpen && activeDropdown === text
                  ? "text-[#00f0ff]"
                  : "text-white hover:text-[#00f0ff]"
              }`}
              onClick={() =>
                text.includes("Portfolio")
                  ? navigate("/portfolio-page")
                  : onNavClick(text)
              }
            >
              {text}
            </button>
            {idx !== navLinks.length - 1 && (
              <span className="mx-2 h-5 w-px bg-white/20" />
            )}
          </div>
        ))}
      </div>

      {/* Right buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-5">
        <button
          onClick={() => navigate("/getintouch")}
          className="bg-[#00f0ff]/20 border border-[#00f0ff] text-white font-bold text-[10px] py-1.5 px-3 sm:text-xs sm:px-4 sm:py-2 md:text-[13px] md:px-5 rounded tracking-widest hover:bg-[#00f0ff]/30 transition-all"
        >
          CONTACT US!
        </button>

        {/* Hamburger */}
        <button
          aria-label="Menu"
          className="ml-1 flex flex-col justify-between h-5 w-5 sm:h-6 sm:w-6 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="block w-full h-0.5 bg-white rounded-full"></span>
          <span className="block w-full h-0.5 bg-white rounded-full my-1"></span>
          <span className="block w-full h-0.5 bg-white rounded-full"></span>
        </button>
      </div>
    </nav>
  );
}
