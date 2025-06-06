import { FadeInUp } from ".";

import { HERO } from "@/constants";

import { SchedulingButton } from "../../modules/scheduling";

export function Hero() {
  return (
    <div className="relative">
      <section className="relative bg-gradient-to-r from-amber-400 to-amber-100 pt-16 md:pt-24 pb-24 md:pb-32 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden z-10">
        <FadeInUp className="relative z-20 max-w-xl text-center md:text-left md:mr-20 mt-8 md:mt-16 md:translate-y-[-40px]">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white text-shadow-2xs mb-4 md:mb-6 leading-tight">
            {HERO.title}
          </h1>
          <p className="text-white text-center md:text-left text-base sm:text-lg font-medium mb-6 text-shadow-2xs leading-relaxed max-w-lg">
            {HERO.description}
          </p>
          <SchedulingButton />
        </FadeInUp>
        <FadeInUp className="relative mt-6 md:mt-0 md:translate-y-[-40px] md:translate-x-10">
          <img
            src={HERO.image}
            alt={HERO.alt}
            className="w-[280px] md:w-[500px] z-10 relative"
          />
        </FadeInUp>
      </section>
    </div>
  );
}
