"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase, MessageCircle } from "lucide-react";
import { BDAGPrice } from "./BDAGPrice";

interface Designer {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate: string;
  completedProjects: number;
  location: string;
  bio: string;
}

interface DesignerCardProps {
  designer: Designer;
}

export function DesignerCard({ designer }: DesignerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={designer.avatar} alt={designer.name} />
          <AvatarFallback className="text-lg">
            {designer.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg">{designer.name}</CardTitle>
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{designer.location}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{designer.rating}</span>
          <span className="text-muted-foreground">({designer.reviews} reviews)</span>
        </div>

        <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">
          {designer.bio}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{designer.completedProjects} projects</span>
          </div>
          <div className="flex items-center gap-1">
            <BDAGPrice amount={designer.hourlyRate.replace(' BDAG', '')} showIcon={true} size="sm" />
            <span className="text-muted-foreground">/hr</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4 justify-center">
          {designer.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {designer.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{designer.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            Hire Me
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
