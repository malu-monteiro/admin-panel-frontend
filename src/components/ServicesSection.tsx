import { ServiceCard } from "./ServiceCard";
import Healthcare from "../assets/healthcare.png";
import Daycare from "../assets/daycare.png";
import Training from "../assets/training.png";
import HygienicCare from "../assets/hygienic-care.png";

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
    <section className="bg-gray-100 rounded-2xl shadow-md mx-4 md:mx-24 p-6 mt-10 flex flex-col md:flex-row items-center justify-around gap-6">
      {services.map((service, idx) => (
        <ServiceCard key={idx} {...service} />
      ))}
    </section>
  );
}
