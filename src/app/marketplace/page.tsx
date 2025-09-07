import { JobBoard } from "@/components/marketplace/job-board";

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Design Marketplace</h1>
        <p className="text-muted-foreground text-center">
          Connect with talented designers and bring your creative projects to life with BDAG payments
        </p>
      </div>
      <JobBoard />
    </div>
  );
}
