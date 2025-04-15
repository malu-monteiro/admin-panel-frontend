import { SchedulingButton } from "./SchedulingButton";
import Pets from "../assets/pets.png";

export function Hero() {
  return (
    <section className="relative bg-noise to-amber-0 py-16 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden z-0">
      <div className="relative z-20 max-w-xl text-center md:text-left md:mr-18">
        <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-6">
          We give your pet <br /> the care they deserve
        </h1>
        <p className="text-white/90 mb-6">
          We take good care of your pet with expert grooming, premium supplies,
          <br />
          and lots of love. Because their well-being is our passion!
        </p>
        <SchedulingButton />
      </div>

      <div className="relative mt-10 md:mt-0">
        <img
          src={Pets}
          alt="Dog and cat"
          className="w-[400px] md:w-[500px] z-10 relative"
        />
      </div>
    </section>
  );
}
