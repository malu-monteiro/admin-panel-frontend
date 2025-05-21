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
                <img src={image} alt={alt} className="mx-auto h-64 w-64 mb-6" />
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
