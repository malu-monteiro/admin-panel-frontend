import Sarah from "../../assets/home/our-team/sarah.jpg";
import Michael from "../../assets/home/our-team/michael.jpeg";
import Vanessa from "../../assets/home/our-team/vanessa.jpg";

const team = [
  {
    name: "Sarah Washington",
    role: "Healthcare, Training",
    img: Sarah,
    bg: "bg-yellow-400",
  },
  {
    name: "Michael Ferguson",
    role: "Daycare, Healthcare, Hygienic Care",
    img: Michael,
    bg: "bg-cyan-400",
  },
  {
    name: "Vanessa Maddox",
    role: "Training, Daycare",
    img: Vanessa,
    bg: "bg-rose-400",
  },
];

export function OurTeam() {
  return (
    <section className="w-full py-20 px-6 md:px-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Our Team</h2>

          <div className="h-1 w-24 bg-amber-300 rounded-full mx-auto" />
          <h3 className="text-3xl font-semibold text-gray-900 mt-6">
            Professionals You Can Trust
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center bg-white rounded-2xl"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm">
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="font-bold text-lg md:text-xl text-center">
                {member.name}
              </div>

              <div className="text-gray-500 text-sm text-center mb-2">
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
