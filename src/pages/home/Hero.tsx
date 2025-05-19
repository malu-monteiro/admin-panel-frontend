import { motion } from "framer-motion";

import Pets from "@/assets/hero/pets.png";

import { Title } from "@/components/Title";
import { Navbar } from "@/components/home/Navbar";
import { ServicesSection } from "@/components/home/Hero/ServicesSection";
import { SchedulingButton } from "@/components/home/Hero/SchedulingButton";
import { About } from "./About";
import { Services } from "./Services";
import { Reviews } from "./Reviews";
import Newsletter from "./Newsletter";
import { Footer } from "@/components/home/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeIn" },
};

export const FadeInUp = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div {...fadeInUp} className={className}>
    {children}
  </motion.div>
);

export function Hero() {
  return (
    <>
      <Title>Home</Title>

      <div className="relative">
        <section className="relative bg-noise to-amber-0 pt-24 pb-32 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden z-0">
          <div className="absolute top-0 left-0 w-full px-6 md:px-24">
            <Navbar />
          </div>

          <FadeInUp className="relative z-20 max-w-xl text-center md:text-left md:mr-32 mt-16 md:translate-y-[-40px]">
            <h1 className="text-3xl md:text-5xl font-bold text-white/90 mb-4 md:mb-6">
              We give your pet <br className="hidden md:block" /> the care they
              deserve
            </h1>
            <p className="text-white/90 mb-6 text-sm md:text-base">
              We take good care of your pet with expert grooming, premium
              supplies,
              <br className="hidden md:block" /> and lots of love. Because their
              well-being is our passion!
            </p>
            <SchedulingButton />
          </FadeInUp>

          <FadeInUp className="relative mt-8 md:mt-0 md:translate-y-[-40px]">
            <img
              src={Pets}
              alt="Dog and cat"
              className="w-[280px] md:w-[500px] z-10 relative"
            />
          </FadeInUp>
        </section>

        <FadeInUp className="relative z-30 -mt-20 lg:-mt-36 px-6 md:px-24">
          <ServicesSection />
        </FadeInUp>

        <div className="mt-28 md:mt-44">
          <About />
        </div>

        <div className="mt-28 md:mt-44">
          <Services />
        </div>

        <div className="mt-28 md:mt-44">
          <Reviews />
        </div>

        <div className="mt-28 md:mt-44">
          <Newsletter />
        </div>

        <Footer />
      </div>
    </>
  );
}
