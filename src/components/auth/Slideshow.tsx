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
    <div className="absolute inset-0 h-full w-full">
      <img
        src={Images[currentIndex]}
        alt="Imagem"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
