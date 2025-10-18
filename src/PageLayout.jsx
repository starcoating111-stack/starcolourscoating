// src/components/PageLayout.jsx
export default function PageLayout({ children }) {
  return (
    <div className="relative">
      {/* Background Gradient */}
      <div
        className="fixed top-0 left-0 w-full h-full 
                   bg-gradient-to-b 
                   from-[#5E4B43] 
                   via-[#2E1F1B] 
                   to-[#120a08] 
                   -z-10"
      />

      {/* Page content */}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
