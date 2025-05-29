import { BlockRow } from "./BlockRow";

import { Card } from "@/components/ui/card";

import { useActiveBlocks } from "@/hooks/useActiveBlocks";

export function ActiveBlocks() {
  const { blocks, handleUnblock, formatTimeSlot } = useActiveBlocks();

  return (
    <Card className="p-4 mb-6 max-w-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Time</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <BlockRow
                key={block.id}
                block={block}
                onUnblock={handleUnblock}
                formatTimeSlot={formatTimeSlot}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
