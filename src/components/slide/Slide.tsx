import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/background_cars.jpg",
  "/images/background_cars.jpg",
];

const Slide = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-6 w-full flex justify-center">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300 cursor-pointer" />
    ),
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-8 rounded-2xl overflow-hidden shadow-xl">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-video h-[400px] md:h-[500px]">
            {/* Image with overlay */}
            <div className="absolute inset-0 bg-black/30 z-10" />
            
            <Image
              src={src}
              alt={`carousel-${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              priority={idx === 0}
            />
            
            {/* Content overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                Gestion de Parc Automobile
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md">
                Solution complète pour la gestion et le suivi de votre flotte de véhicules
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg">
                  Consulter le parc
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-medium transition-all transform hover:scale-105 backdrop-blur-sm">
                  Ajouter un véhicule
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Custom arrow components
function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 z-30 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 rounded-full transition-all backdrop-blur-sm"
      aria-label="Next slide"
    >
      <ChevronRight className="w-6 h-6 text-white" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 z-30 -translate-y-1/2 p-2 bg-white/30 hover:bg-white/50 rounded-full transition-all backdrop-blur-sm"
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-6 h-6 text-white" />
    </button>
  );
}

export default Slide;