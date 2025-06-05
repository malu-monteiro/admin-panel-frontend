import { useState } from "react";

import { OUR_NEWS } from "@/constants";
import { Button } from "@/components/ui/button";

export function OurNews() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateEmail(email)) {
      setErrorMsg(OUR_NEWS.messages.invalidEmail);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await new Promise((res) => setTimeout(res, 1500));
      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg(OUR_NEWS.messages.genericError);
      setStatus("error");
    }
  };

  return (
    <section className="w-full py-20 px-6 md:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            {OUR_NEWS.titles.main}
          </h2>
          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto" />
          <h3 className="text-3xl font-semibold text-gray-900 mt-6 mb-4">
            {OUR_NEWS.titles.subtitle}
          </h3>
          <p className="text-gray-600 mb-8 whitespace-pre-line">
            {OUR_NEWS.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder={OUR_NEWS.placeholders.emailInput}
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
                {OUR_NEWS.messages.success}
              </p>
            )}

            <Button
              variant="appointment"
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? OUR_NEWS.messages.submitting
                : OUR_NEWS.messages.subscribeButton}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
