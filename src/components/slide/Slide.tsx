import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { NextArrow, PrevArrow } from "../custom arrows/Arrows";

const images = [
  "/images/background_cars.jpg",
  "/images/background_cars.jpg",
];

const Slide = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          bottom: "10px",
          display: "flex",
          justifyContent: "center",
          padding: "10px 0",
        }}
      >
        <ul style={{ margin: "0px", padding: 0, display: "flex", gap: 8 }}>{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
          cursor: "pointer",
        }}
      />
    ),
  };

  return (
    <div className="relative w-3/4 mx-auto mt-8 rounded-3xl overflow-hidden shadow-lg">
      <Slider {...settings}>
        {images.map((src, idx) => (
          <div key={idx} className="relative h-56 md:h-96">
            <Image
              src={src}
              alt={`carousel-${idx + 1}`}
              fill
              className="object-cover h-full w-full bg-position-center bg-no-repeat "
              sizes="100vw"
              priority={idx === 0}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slide;
