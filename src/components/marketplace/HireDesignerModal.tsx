"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface HireDesignerModalProps {
  designer?: Designer;
  isOpen: boolean;
  onClose: () => void;
}

export function HireDesignerModal({ designer, isOpen, onClose }: HireDesignerModalProps) {
  if (!designer) return null;

  const handleHire = () => {
    // Here you would typically initiate the hiring process
    console.log("Hiring designer:", designer.name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hire Designer</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Designer Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={designer.avatar} alt={designer.name} />
              <AvatarFallback className="text-lg">
                {designer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{designer.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{designer.location}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{designer.rating}</span>
                <span className="text-muted-foreground">({designer.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <BDAGPrice amount={designer.hourlyRate.replace(' BDAG', '')} showIcon={true} size="lg" className="justify-center mb-1" />
              <div className="text-sm text-muted-foreground">per hour</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{designer.completedProjects}</div>
              <div className="text-sm text-muted-foreground">projects completed</div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <p className="text-muted-foreground">{designer.bio}</p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {designer.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Portfolio/Projects Preview */}
          <div>
            <h4 className="font-semibold mb-2">Recent Work</h4>
            <div className="grid grid-cols-3 gap-2">
              {/* Placeholder for portfolio images */}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button onClick={handleHire} className="flex-1">
              Hire Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
