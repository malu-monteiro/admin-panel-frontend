import Cat1 from "@/assets/hero/veterinary-dog.svg";
import Cat2 from "@/assets/hero/pet-care.svg";
import Cat3 from "@/assets/hero/dog-and-cat.svg";

import { FadeInUp } from "./Hero";

export function Services() {
  return (
    <div className="bg-gray-100 relative z-20 py-20 px-6 md:px-24 -mt-20 lg:-mt-32">
      <FadeInUp className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Our Service
          </h2>

          <div className="h-1 w-24 bg-amber-400 rounded-full mx-auto" />
          <h3 className="text-3xl font-semibold text-gray-900 mt-6">
            How Does It Work
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src={Cat1}
              alt="Service 1"
              className="mx-auto h-64 w-64 mb-6"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Book Your Visit
            </h4>
            <p className="text-gray-600 px-4">
              Choose your services and time slot in our quick online scheduler.
            </p>
          </div>

          <div className="text-center">
            <img
              src={Cat2}
              alt="Service 2"
              className="mx-auto h-64 w-64 mb-6"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Expert Care
            </h4>
            <p className="text-gray-600 px-4">
              Our certified team welcomes your pet with a warm meet-and-greet.
            </p>
          </div>

          <div className="text-center">
            <img
              src={Cat3}
              alt="Service 3"
              className="mx-auto h-64 w-64 mb-6"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Happy Pickup
            </h4>
            <p className="text-gray-600 px-4">
              Get real-time updates and pick up your happy, healthy companion.
            </p>
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}
