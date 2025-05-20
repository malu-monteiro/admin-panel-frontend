import { Link } from "react-router-dom";
import error404 from "../assets/error404.gif";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <img src={error404} alt="404 Error" className="w-64 h-auto" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-accent-foreground">
        Back to{" "}
        <Link to="/" className="text-sky-600 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
