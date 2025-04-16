import { SchedulingButton } from "../components/Page/SchedulingButton";
import Pets from "../assets/pets.png";
import { Navbar } from "../components/Page/Navbar";
import { ServicesSection } from "../components/Page/ServicesSection";
import { Footer } from "../components/Page/Footer";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="relative">
      <section className="relative bg-noise to-amber-0 pt-24 pb-32 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden z-0">
        <div className="absolute top-0 left-20 w-full px-4 md:left-12 md:px-0">
          <Navbar />
        </div>

        <motion.div
          className="relative z-20 max-w-xl text-center md:text-left md:mr-32 mt-16 md:translate-y-[-40px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeIn" }}
        >
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
        </motion.div>

        <motion.div
          className="relative mt-8 md:mt-0 md:translate-y-[-40px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeIn" }}
        >
          <img
            src={Pets}
            alt="Dog and cat"
            className="w-[280px] md:w-[500px] z-10 relative"
          />
        </motion.div>
      </section>

      <motion.div
        className="relative z-30 -mt-20 lg:-mt-36 px-6 md:px-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeIn" }}
      >
        <ServicesSection />
      </motion.div>

      <div className="mb-5 px-6 md:px-24">
        <Footer />
      </div>
    </div>
  );
}
