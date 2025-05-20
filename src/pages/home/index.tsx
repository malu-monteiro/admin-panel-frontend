import { motion } from "framer-motion";

import { Title } from "@/components/Title";

import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";

import { Hero } from "./Hero";
import { About } from "./About";
import { OurTeam } from "./OurTeam";
import { Reviews } from "./Reviews";
import { Newsletter } from "./Newsletter";
import { Services } from "./Services";
import { ServicesSection } from "@/components/home/Hero/ServicesSection";

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

export function Home() {
  return (
    <>
      <Title>Home</Title>

      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>

      <Hero />

      <FadeInUp className="relative z-30 -mt-20 lg:-mt-36 px-6 md:px-24">
        <div className="max-w-6xl mx-auto">
          <ServicesSection />
        </div>
      </FadeInUp>

      <About />
      <Services />
      <Reviews />
      <OurTeam />
      <Newsletter />

      <Footer />
    </>
  );
}
