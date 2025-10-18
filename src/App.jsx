import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import GetInTouchPage from "./pages/GetInTouchPage";
import LandingPage from "./pages/LandingPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import AboutPage from "./pages/AboutPage";
import FAQs from "./pages/FAQs";
import PortfolioPage from "./pages/PortfolioPage";
import Preloader from "./Preloader";
import ScrollToTop from "./ScrollToTop";

function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    const removeTimer = setTimeout(() => setLoading(false), 1500); // Slightly longer than fade duration
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {/* Always keep Preloader until fade finishes */}
      {loading && <Preloader fadeOut={fadeOut} />}

      {/* Page content only shows after preloader fully fades */}
      {!loading && (
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/getintouch" element={<GetInTouchPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/portfolio-page" element={<PortfolioPage />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
