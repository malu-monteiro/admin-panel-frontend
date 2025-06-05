import { motion } from "framer-motion";

import { OUR_SERVICE } from "@/constants";

export function OurService() {
  return (
    <section className="w-full py-20 px-6 md:px-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            {OUR_SERVICE.title}
          </h2>

          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto" />

          <h3 className="text-3xl font-semibold text-gray-900 mt-6">
            {OUR_SERVICE.subtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OUR_SERVICE.services.map(
            ({ image, alt, title, description }, idx) => (
              <div key={idx} className="text-center">
                <motion.img
                  src={image}
                  alt={alt}
                  className="mx-auto h-64 w-64 mb-6 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9, borderRadius: "0.75rem" }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  }}
                />
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  {title}
                </h4>
                <p className="text-gray-600 px-4">{description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
