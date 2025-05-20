import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await new Promise((res) => setTimeout(res, 1500));
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="w-full py-20 px-6 md:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            Our News & Promotions
          </h2>
          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto" />
          <h3 className="text-3xl font-semibold text-gray-900 mt-6 mb-4">
            Join Our Newsletter
          </h3>
          <p className="text-gray-600 mb-8">
            Be the first to know about exclusive deals, pet care tips and more.
            <br />
            Sign up for free and stay connected!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                status === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              required
            />

            {status === "error" && (
              <p className="text-red-600 text-sm">{errorMsg}</p>
            )}

            {status === "success" && (
              <p className="text-green-500 bg-green-100 px-4 py-3 text-center rounded-md">
                Thank you for subscribing!
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
