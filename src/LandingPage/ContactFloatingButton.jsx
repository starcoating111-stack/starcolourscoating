import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactFloatingButton({
  size = 64,
  offset = { right: 24, bottom: 24 },
  ariaLabel = 'Go to Get in Touch page',
}) {
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');

  // Scroll detection logic
  useEffect(() => {
    const threshold = 200; // px before button shows

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Detect direction
      if (Math.abs(currentY - lastScrollY) > 5) {
        if (currentY > lastScrollY) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        setLastScrollY(currentY);
      }

      // Show after threshold & scrolling down
      if (currentY > threshold && scrollDirection === 'down') {
        setShowButton(true);
      } 
      // Hide on scroll up
      else if (scrollDirection === 'up') {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);

  const wrapperStyle = {
    width: size,
    height: size,
    right: offset.right,
    bottom: offset.bottom,
  };

  const handleClick = () => {
    navigate('/getintouch');
  };

  return (
    <div
      style={wrapperStyle}
      className={`fixed z-50 flex items-center justify-center transition-transform duration-300 ${
        showButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <motion.button
        onClick={handleClick}
        aria-label={ariaLabel}
        title="Get in Touch"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.08, rotate: -6 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="w-full h-full rounded-full shadow-2xl p-2 backdrop-blur-sm
                   bg-gradient-to-br from-[#0ea5a4]/90 to-[#06b6d4]/90
                   hover:shadow-[0_8px_30px_rgba(8,145,178,0.25)]
                   flex items-center justify-center ring-2 ring-transparent hover:ring-white/20
                   focus:outline-none focus:ring-4 focus:ring-white/20"
      >
        <MessageCircle size={size * 0.45} aria-hidden="true" />
      </motion.button>
    </div>
  );
}
