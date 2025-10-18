export default function Parallax({ backgroundUrl }) {
  return (
    <section
      className="relative w-full overflow-hidden mt-[50px]"
      aria-label="Hero banner"
    >
      {/* Large screens: No changes here */}
      <div
        className="hidden md:block absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* Small screens: Updated for responsive cropping from the right */}
      <div
        className="block md:hidden absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundPosition: "left center", // Anchors image to the left
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover", // Scales image to cover, cropping the right
        }}
      />

      {/*
        Content container which defines the component's height.
        MODIFIED: Changed min-h-[60vh] to min-h-[45vh] for smaller screens.
      */}
      <div className="relative z-10 flex items-center justify-center min-h-[45vh] md:min-h-screen px-4">
        {/* Your title/subtitle content can go here */}
      </div>
    </section>
  );
}