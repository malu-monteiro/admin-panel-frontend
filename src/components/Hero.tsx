import { SchedulingButton } from "./SchedulingButton";
import Cats from "../assets/dog-and-cat.png";

export function Hero() {
  return (
    <section className="bg-yellow-300 py-16 px-6 md:px-24 flex flex-col md:flex-row items-center justify-center relative overflow-hidden">
      {/* Texto principal */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          We take good <br /> care of your pet
        </h1>
        <p className="text-white/90 mb-6">
          We take good care of your pet with expert grooming, premium supplies,
          and lots of love. Because their well-being is our passion!
        </p>
        <SchedulingButton />
      </div>

      {/* Imagem do cachorro */}
      <div className="relative mt-10 md:mt-0">
        <img
          src={Cats}
          alt="Dog in pajamas"
          className="w-[400px] md:w-[500px] z-10 relative"
        />

        {/* Texto circular decorativo */}
        <div className="absolute -top-10 -left-10 hidden md:block">
          {/* Inserir SVG ou imagem do texto circular */}
        </div>

        {/* Imagem pequena decorativa */}
        {/* <img
          src={}
          alt="Blurry"
          className="absolute bottom-0 right-0 w-24 md:w-28 rotate-6"
        /> */}
      </div>

      {/* Patas no fundo */}
      <div className="absolute inset-0 bg-[url('/paws.png')] bg-no-repeat bg-center opacity-10 pointer-events-none" />
    </section>
  );
}
