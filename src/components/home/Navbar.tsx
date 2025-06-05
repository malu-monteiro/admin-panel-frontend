import { Link } from "react-router-dom";

import PawPrint from "../../assets/home/navbar/paw.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-transparent w-full px-6 md:px-24">
      <div className="max-w-6xl mx-auto flex h-16 items-center px-0">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={PawPrint} alt="Paw Icon" className="h-6 w-6" />
          <span className="text-xl font-bold text-white text-shadow">
            Pawfaction
          </span>
        </Link>
      </div>
    </nav>
  );
}
