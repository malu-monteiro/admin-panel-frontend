import { useEffect, useState } from "react";

import Automotive from "@/assets/slideshow/automotive-business.jpg";
import CoffeeShop from "@/assets/slideshow/coffeeshop-business.jpg";
import Hairdresser from "@/assets/slideshow/hairdresser-business.jpg";
import Petshop from "@/assets/slideshow/petshop-business.jpg";
import Restaurant from "@/assets/slideshow/restaurant-business.jpg";
import Spa from "@/assets/slideshow/spa-business.jpg";

const Images = [Automotive, CoffeeShop, Hairdresser, Petshop, Restaurant, Spa];

export function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === Images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">
      <img
        src={Images[currentIndex]}
        alt="Imagem"
        className="h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Left side with blur */}
      <div
        className="
      absolute left-0 top-0
      h-full w-32
      bg-gradient-to-r from-white/40 to-transparent
      pointer-events-none
      z-10
    "
      />
    </div>
  );
}
