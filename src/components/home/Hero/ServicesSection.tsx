import { ServiceCard } from "./ServiceCard";

import Daycare from "@/assets/service-section/daycare.png";
import Training from "@/assets/service-section/training.png";
import Healthcare from "@/assets/service-section/healthcare.png";
import HygienicCare from "@/assets/service-section/hygienic-care.png";

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
    <section className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start justify-center gap-6">
      {services.map((service, idx) => (
        <ServiceCard key={idx} {...service} />
      ))}
    </section>
  );
}
