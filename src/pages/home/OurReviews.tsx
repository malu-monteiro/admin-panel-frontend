import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { OUR_REVIEWS } from "@/constants";

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
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-amber-300">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function OurReviews() {
  const firstRow = OUR_REVIEWS.reviewsList.slice(
    0,
    OUR_REVIEWS.reviewsList.length / 2
  );
  const secondRow = OUR_REVIEWS.reviewsList.slice(
    OUR_REVIEWS.reviewsList.length / 2
  );

  return (
    <section className="w-full py-20 px-6 md:px-24 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">
          {OUR_REVIEWS.titles.main}
        </h2>
        <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto" />
        <h3 className="text-3xl font-semibold text-gray-900 mt-6">
          {OUR_REVIEWS.titles.subtitle}
        </h3>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden max-w-6xl mx-auto">
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

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
      </div>
    </section>
  );
}
