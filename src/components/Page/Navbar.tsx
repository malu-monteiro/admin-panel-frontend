import PawPrint from "../../assets/paw.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <img src={PawPrint} alt="Paw Icon" className="h-6 w-6" />
          <span className="text-xl font-bold text-white">Pawfection</span>
        </div>
      </div>
    </nav>
  );
}
