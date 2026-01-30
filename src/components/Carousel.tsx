import { useState, useEffect } from 'react';

interface CarouselImage {
  id: string;
  url: string;
  createdAt: string;
}

interface CarouselProps {
  images: CarouselImage[] | string[];
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert images to consistent format
  const imageUrls = images.map(img => 
    typeof img === 'string' ? img : img.url
  );

  useEffect(() => {
    if (imageUrls.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [imageUrls]);

  if (imageUrls.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto h-64 md:h-96 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100 border border-primary-200">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-200 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">Welcome to Our Restaurant</h3>
          <p className="text-lg text-neutral-600">Upload images to showcase your restaurant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-elegant-xl">
      <div className="relative w-full h-64 md:h-96">
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={imageUrl}
              alt={`Restaurant view ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/20 to-transparent"></div>
          </div>
        ))}

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-500 scale-125' 
                  : 'bg-white/70 hover:bg-white/90 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}