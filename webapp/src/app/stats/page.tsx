import { OutcomeStats } from "@/components/stats/OutcomeStats";
import { mockCourierStats } from "@/lib/statsData";

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OutcomeStats 
          courierStats={mockCourierStats}
          variant="full"
          showTitle={true}
        />
      </div>
    </div>
  );
}
