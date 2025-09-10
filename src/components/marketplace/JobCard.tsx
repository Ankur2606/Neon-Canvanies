
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Loader2 } from "lucide-react";
import { BDAGPrice } from "./BDAGPrice";
import { useBdagTransfer } from "@/hooks/use-bdag-transfer";

const PROJECT_WALLET_ADDRESS = "0x0734EdcC126a08375a08C02c3117d44B24dF47Fa";

interface Job {
  id: number;
  title: string;
  description: string;
  budget: string;
  skills: string[];
  postedBy: string;
  postedDate: string;
  status: string;
}

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const { transferBdag, isTransferring } = useBdagTransfer();

  const handleApply = () => {
    // Use the lower end of the budget range as the application fee.
    // E.g., "50 - 100 BDAG" -> "50"
    const applyAmount = job.budget.split(' ')[0];
    transferBdag(PROJECT_WALLET_ADDRESS, applyAmount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {job.postedBy.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{job.postedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.postedDate}</span>
              </div>
            </div>
          </div>
          <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {job.description}
        </p>

        <BDAGPrice amount={job.budget} className="mb-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleApply} disabled={isTransferring}>
            {isTransferring ? <Loader2 className="animate-spin" /> : null}
            {isTransferring ? "Applying..." : "Apply Now"}
          </Button>
          <Button variant="outline" size="sm">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
