import { ABOUT } from "@/constants";

export function About() {
  return (
    <section className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-12 md:flex-row md:items-center md:gap-24">
        <div className="md:w-1/2">
          <img src={ABOUT.image} alt={ABOUT.alt} className="h-auto w-full" />
        </div>

        <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-medium text-gray-800">{ABOUT.title}</h2>

          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto md:mx-0" />

          <h3 className="text-3xl font-semibold text-gray-900">
            {ABOUT.subtitle}
          </h3>

          <div className="space-y-4 text-gray-600">
            {ABOUT.texts.map((text, idx) => (
              <p
                key={idx}
                className="text-sm text-justify md:text-base leading-relaxed"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
