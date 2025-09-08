import { JobBoard } from "@/components/marketplace/job-board";
import { Header } from "@/components/header";

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-4 flex justify-start">
          <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            ← Back to Home
          </a>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Design Marketplace</h1>
          <p className="text-muted-foreground text-center">
            Connect with talented designers and bring your creative projects to life with BDAG payments
          </p>
        </div>
        <JobBoard />
      </div>
    </>
  );
}
