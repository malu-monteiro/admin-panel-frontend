import { motion } from "framer-motion";
import { OUR_TEAM } from "@/constants";

const cardVariants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: { opacity: 1, y: 0 },
};

export function OurTeam() {
  return (
    <section className="w-full py-20 px-6 md:px-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-2xl font-medium text-gray-800 mb-4"
          >
            Our Team
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-amber-300 rounded-full mx-auto"
          />

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold text-gray-900 mt-6"
          >
            Professionals You Can Trust
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OUR_TEAM.map((member, idx) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              }}
              className="flex flex-col items-center bg-white rounded-2xl shadow-lg transition-shadow cursor-pointer"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="font-bold text-lg md:text-xl text-center mb-2">
                {member.name}
              </div>
              <p className="text-gray-500 text-sm text-center px-4 pb-4">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
