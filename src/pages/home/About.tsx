import Cat from "@/assets/hero/cat.png";

export function About() {
  return (
    <section className="w-full py-28 px-6 md:px-24 bg-white">
      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-12 md:flex-row md:items-center md:gap-24">
        <div className="md:w-1/2">
          <img src={Cat} alt="Cat" className="h-auto w-full" />
        </div>

        <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl font-medium text-gray-800">About us</h2>

          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto md:mx-0" />

          <h3 className="text-3xl font-semibold text-gray-900">
            The Best Service
          </h3>

          <div className="space-y-4 text-gray-600">
            <p className="text-sm md:text-base leading-relaxed">
              At Pawfaction, we believe that every pet deserves exceptional
              care, love, and attention. That’s why we’ve created a welcoming
              space where your furry companions can thrive, whether they’re here
              for a quick visit or an extended stay.
            </p>

            <p className="text-sm md:text-base leading-relaxed">
              Our services are designed with your pet’s well-being in mind. With
              a dedicated team of professionals and a passion for animals,
              Pawfaction is more than a service, it’s a second home for your
              pet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
