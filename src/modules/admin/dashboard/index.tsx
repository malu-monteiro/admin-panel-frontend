import { MostBookedServicesChart } from "./MostBookedServicesChart";
import { MostBookedTimesChart } from "./MostBookedTimesChart";

export function Dashboard() {
  return (
    <div className="py-4 px-4 md:px-6 lg:px-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch max-w-[950px]">
        <MostBookedServicesChart />
        <MostBookedTimesChart />
      </div>
    </div>
  );
}
