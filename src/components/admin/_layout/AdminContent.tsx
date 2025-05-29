import { BusinessHours } from "../BusinessHours";
import { ManageServices } from "../ManageServices";
import { ManageDates } from "../ManageDates";
import { ActiveBlocks } from "../active-blocks";

export function AdminContent({ activePanel }: { activePanel: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {{
        "Business Hours": <BusinessHours />,
        "Manage Services": <ManageServices />,
        "Manage Dates": <ManageDates />,
        "Active Blocks": <ActiveBlocks />,
      }[activePanel] || <div>Select item</div>}
    </div>
  );
}
