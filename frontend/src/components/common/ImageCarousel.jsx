import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ImageCarousel = ({ imageUrls, altText, isSold = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!imageUrls || imageUrls.length === 0) {
        return <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-medium">No Image</div>;
    }

    if (imageUrls.length === 1) {
        return <img src={imageUrls[0]} alt={altText} className="w-full h-full object-cover" />;
    }

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    return (
        <div className="relative w-full h-full group/carousel overflow-hidden">
            <img src={imageUrls[currentIndex]} alt={`${altText} - ${currentIndex + 1}`} className={`w-full h-full object-cover transition-opacity duration-300 ${isSold ? 'opacity-40 grayscale' : ''}`} />
            
            {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] z-20 pointer-events-none">
                    <span className="text-3xl font-black text-gray-900 tracking-widest uppercase rotate-[-15deg] border-4 border-gray-900 px-4 py-2 opacity-80 mix-blend-multiply">Sold Out</span>
                </div>
            )}

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                <button onClick={prevImage} className="bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors focus:outline-none">
                    <FiChevronLeft size={18} />
                </button>
                <button onClick={nextImage} className="bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors focus:outline-none">
                    <FiChevronRight size={18} />
                </button>
            </div>
            
            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
                {imageUrls.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/60'}`} />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
