import { ServiceCard } from "./ServiceCard";
import Healthcare from "@/assets/service-section/healthcare.png";
import Daycare from "@/assets/service-section/daycare.png";
import Training from "@/assets/service-section/training.png";
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
    description:
      "Veterinary care, vaccinations, and treatments for a healthy pet.",
  },
  {
    icon: Daycare,
    title: "Daycare",
    description: "Safe play and socialization for your pet while you're away.",
  },
  {
    icon: Training,
    title: "Training",
    description: "Obedience and behavior training with positive methods.",
  },
  {
    icon: HygienicCare,
    title: "Hygienic care",
    description: "Professional grooming, bathing, and dental care.",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-gray-50 rounded-2xl shadow-md mx-4 md:mx-24 p-6 mt-10 flex flex-col sm:flex-row flex-wrap lg:flex-nowrap items-start justify-center gap-6">
      {services.map((service, idx) => (
        <ServiceCard key={idx} {...service} />
      ))}
    </section>
  );
}
