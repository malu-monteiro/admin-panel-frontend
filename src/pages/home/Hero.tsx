import { FadeInUp } from ".";

import { HERO } from "@/constants";

import { SchedulingButton } from "@/components/home/Hero/SchedulingButton";

export function Hero() {
  return (
    <div className="relative">
      <section className="relative bg-hero-bg pt-24 pb-32 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden z-10">
        <FadeInUp className="relative z-20 max-w-xl text-center md:text-left md:mr-46 mt-16 md:translate-y-[-40px]">
          <h1 className="text-3xl md:text-5xl font-bold text-white/90 mb-4 md:mb-6">
            {HERO.title}
          </h1>
          <p className="text-white/90 mb-6 text-sm md:text-base">
            {HERO.description}
          </p>
          <SchedulingButton />
        </FadeInUp>

        <FadeInUp className="relative mt-8 md:mt-0 md:translate-y-[-40px]">
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
