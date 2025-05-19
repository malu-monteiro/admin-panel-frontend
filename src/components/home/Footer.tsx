import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import PawPrint from "../../assets/Navbar/paw.png";

export function Footer() {
  return (
    <footer className="relative z-10 py-12 px-4 md:px-16 bg-amber-300">
      <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-wrap"></div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <img src={PawPrint} alt="Paw Icon" className="h-6 w-6" />
            <span className="text-xl font-bold text-neutral-100">
              Pawfaction
            </span>
          </div>
          <p className="text-neutral-100 text-sm">
            Every pawprint matters. We care for your pets with the same love you
            do.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-neutral-100">Company</h4>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <a href="#" className="text-white hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-neutral-100">Useful Links</h4>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>
              <a href="#" className="text-white hover:underline">
                Discount
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:underline">
                F.A.Q
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start">
          <div>
            <h4 className="font-semibold mb-3 text-neutral-100">
              Customer Service
            </h4>
            <ul className="space-y-2 text-white text-sm mb-4 hover:underline">
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 text-xl text-white">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="X">
              <FaXTwitter />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-400">
        © Copyright 2025. Design by{" "}
        <a
          href="https://github.com/malu-monteiro"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          malu-monteiro
        </a>
      </div>
    </footer>
  );
}

// text-[#2196F3]  hover:text-[#002857]
