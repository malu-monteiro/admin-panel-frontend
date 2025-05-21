import { ServiceCard } from "./ServiceCard";

import Daycare from "@/assets/home/services-section/daycare.png";
import Training from "@/assets/home/services-section/training.png";
import Healthcare from "@/assets/home/services-section/healthcare.png";
import HygienicCare from "@/assets/home/services-section/hygienic-care.png";

type Service = {
  icon: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: Healthcare,
    title: "Healthcare",
    description: "Checkups, vaccines, and medical care.",
  },
  {
    icon: Daycare,
    title: "Daycare",
    description: "Fun and care while you're away.",
  },
  {
    icon: Training,
    title: "Training",
    description: "Positive behavior and obedience training.",
  },
  {
    icon: HygienicCare,
    title: "Hygienic Care",
    description: "Bathing, grooming, and hygiene.",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start justify-center gap-6 mt-10">
      {services.map((service, idx) => (
        <ServiceCard key={idx} {...service} />
      ))}
    </section>
  );
}
