import { Dashboard } from "./dashboard";
import { BusinessHours } from "./business-hours";
import { ManageServices } from "./manage-services";
import { ManageDates } from "./manage-dates";
import { ActiveBlocks } from "./active-blocks";

export function AdminContent({ activePanel }: { activePanel: string }) {
  let contentToRender;

  switch (activePanel) {
    case "Dashboard":
      contentToRender = <Dashboard />;
      break;
    case "Business Hours":
      contentToRender = <BusinessHours />;
      break;
    case "Manage Services":
      contentToRender = <ManageServices />;
      break;
    case "Manage Dates":
      contentToRender = <ManageDates />;
      break;
    case "Active Blocks":
      contentToRender = <ActiveBlocks />;
      break;
    default:
      contentToRender = <div>Please select an item.</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">{contentToRender}</div>
  );
}
