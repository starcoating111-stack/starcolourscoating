import { useEffect, useState } from 'react';
import client from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';


const builder = imageUrlBuilder(client);
const urlFor = (src) => (src ? builder.image(src).auto('format') : null);

const SECTION_BG = "bg-white/50";  
const CHAMPAGNE_GOLD = "#E6D8B8";  


const initials = (name) =>
  name
    ? name
        .split(' ')
        .map((word) => word)
        .join('')
        .toUpperCase()
    : '';

const ClientReviews = () => {
  // 1-4. States
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // 5. Effect: viewport listener
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  // 6. Effect: fetch data
  useEffect(() => {
    client
      .fetch(`*[_type == "reviews"]{
        name,
        location,
        feedback,
        rating,
        image{
          asset->{_id, url},
          alt
        }
      }`)
      .then((data) => {
        setReviews(data || []);
        setIndex(0);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Derivations (no hooks below this line)
  const isMobile = vw < 768;
  const review = reviews[index];

  // Compute photo URL without useMemo to avoid hook-order changes
  const photoUrl =
    review?.image?.asset
      ? urlFor(review.image)
          .width(isMobile ? 400 : 600)
          .height(isMobile ? 400 : 600)
          .fit('crop')
          .url()
      : null;

  if (loading) {
    return (
      <section className={`py-10 px-2 sm:px-0 flex items-center justify-center ${SECTION_BG}`}>
        <p className="text-gray-600 font-serif text-lg">Loading reviews...</p>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section className={`py-10 px-2 sm:px-0 flex items-center justify-center ${SECTION_BG}`}>
        <p className="text-gray-600 font-serif text-lg">No reviews found.</p>
      </section>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? reviews.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === reviews.length - 1 ? 0 : i + 1));

  return (
    <section className={`py-8 px-3 sm:px-4 flex flex-col items-center ${SECTION_BG}`}>
      <div className="w-full max-w-4xl">
        {/* Desktop/Tablet: buttons at sides; Mobile: separate block below */}
        <div className="hidden md:flex items-center justify-center gap-8 w-full">
          {/* Prev */}
          <button
            aria-label="Previous testimonial"
            onClick={prev}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Card */}
          <div className="flex md:flex-row flex-col items-center md:items-start gap-4 md:gap-6 px-4 md:px-6 py-6 md:py-8 ">
            {/* Avatar */}
            {photoUrl ? (
              <div
                className="rounded-full overflow-hidden flex-shrink-0 select-none"
                style={{
                  height: 96,
                  width: 96,
                  border: `3px solid ${CHAMPAGNE_GOLD}`,
                }}
              >
                <img
                  src={photoUrl}
                  alt={review?.image?.alt || review?.name || 'Client photo'}
                  className="w-full h-full object-cover object-bottom"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 select-none"
                style={{
                  height: 90,
                  width: 90,
                  background: '#222',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 32,
                  border: `3px solid ${CHAMPAGNE_GOLD}`,
                }}
              >
                {initials(review.name)}
              </div>
            )}

            {/* Text */}
            <div className="flex flex-col gap-2 md:gap-3 w-full">
              <p className="text-base md:text-lg font-serif text-gray-700 break-words" style={{ lineHeight: 1.6 }}>
                <Quote size={24} className="inline-block -mt-1 mr-1 text-gray-400 align-top" />
                {review.feedback}
              </p>
              <div className="mt-1 md:mt-2 font-semibold text-lg md:text-xl font-serif text-gray-900">
                - {review.name}
                {review.location ? `, ${review.location}` : ''}
              </div>
              {review.rating && (
                <div className="mt-0.5 md:mt-1 text-yellow-500 font-semibold">⭐ {review.rating} / 5</div>
              )}
            </div>
          </div>

          {/* Next */}
          <button
            aria-label="Next testimonial"
            onClick={next}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Mobile layout: Card full-width; buttons below */}
        <div className="md:hidden w-full">
          <div className="flex flex-col items-center gap-4 px-4 py-6 bg-white/60 rounded-lg shadow-sm w-full">
            {/* Avatar */}
            {photoUrl ? (
              <div
                className="rounded-full overflow-hidden flex-shrink-0 select-none"
                style={{
                  height: 84,
                  width: 84,
                  border: `3px solid ${CHAMPAGNE_GOLD}`,
                }}
              >
                <img
                  src={photoUrl}
                  alt={review?.image?.alt || review?.name || 'Client photo'}
                  className="w-full h-full object-cover object-bottom"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 select-none"
                style={{
                  height: 84,
                  width: 84,
                  background: '#222',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 28,
                  border: `3px solid ${CHAMPAGNE_GOLD}`,
                }}
              >
                {initials(review.name)}
              </div>
            )}

            {/* Text */}
            <div className="flex flex-col gap-2 w-full">
              <p className="text-base font-serif text-gray-700 break-words" style={{ lineHeight: 1.6 }}>
                <Quote size={22} className="inline-block -mt-1 mr-1 text-gray-400 align-top" />
                {review.feedback}
              </p>
              <div className="mt-1 font-semibold text-lg font-serif text-gray-900">
                - {review.name}
                {review.location ? `, ${review.location}` : ''}
              </div>
              {review.rating && (
                <div className="mt-0.5 text-yellow-500 font-semibold">⭐ {review.rating} / 5</div>
              )}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              aria-label="Previous testimonial"
              onClick={prev}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={next}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center mt-4 gap-2">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={`inline-block h-2 w-2 rounded-full transition-all duration-200 ${
                i === index ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
