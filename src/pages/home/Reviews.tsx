import { Marquee } from "@/components/magicui/marquee";

import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Milo Bennett",
    username: "@milo.b",
    body: "They treated my pup with so much care and attention. I couldn’t ask for better!",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
  },
  {
    name: "Luna Harper",
    username: "@lunah",
    body: "My dog came home happy, calm, and clearly well cared for. Highly recommend!",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png",
  },
  {
    name: "Theo Lang",
    username: "@theolang",
    body: "The trainers are patient, professional, and truly love animals.",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
  },
  {
    name: "Zara Quinn",
    username: "@zquinn",
    body: "I brought my cat in for a hygienic care session, and they did an incredible job!",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_9.png",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "The Daycare and grooming services are top-notch.",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png",
  },
  {
    name: "Finn Dawson",
    username: "@finnd",
    body: "From training to health checkups, every service we’ve tried has been incredible.",
    img: "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_14.png",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width={32} height={32} alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Reviews() {
  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <div className="relative z-20 py-20 px-6 md:px-24 -mt-20 lg:-mt-32">
      <div className="text-center mb-16">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Our Reviews</h2>

        <div className="h-1 w-24 bg-amber-400 rounded-full mx-auto" />
        <h3 className="text-3xl font-semibold text-gray-900 mt-6">
          What They Say?
        </h3>
      </div>

      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
