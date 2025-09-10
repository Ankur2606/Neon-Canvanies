
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Briefcase, Users, Star } from "lucide-react";
import { JobCard } from "./JobCard";
import { DesignerCard } from "./DesignerCard";
import { PostJobModal } from "./PostJobModal";
import { DesignerRegistration } from "./designer-registration";

export function JobBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showDesignerRegistration, setShowDesignerRegistration] = useState(false);

  // Mock data - in a real app, this would come from an API
  const jobs = [
    {
      id: 1,
      title: "Logo Design for Tech Startup",
      description: "Need a modern, minimalist logo for a SaaS company",
      budget: "20 BDAG",
      skills: ["Logo Design", "Branding", "Adobe Illustrator"],
      postedBy: "TechCorp Inc.",
      postedDate: "2 days ago",
      status: "open"
    },
    {
      id: 2,
      title: "Website UI/UX Design",
      description: "Complete redesign of e-commerce website",
      budget: "200 - 300 BDAG",
      skills: ["UI/UX", "Figma", "Prototyping"],
      postedBy: "E-commerce Solutions",
      postedDate: "1 week ago",
      status: "open"
    },
    {
      id: 3,
      title: "Mobile App Design",
      description: "Design screens for a fitness tracking mobile app",
      budget: "150 - 250 BDAG",
      skills: ["Mobile UI", "iOS Design", "Android Design"],
      postedBy: "FitTech Labs",
      postedDate: "3 days ago",
      status: "open"
    }
  ];

  const designers = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      rating: 4.9,
      reviews: 127,
      skills: ["Logo Design", "Branding", "UI/UX"],
      hourlyRate: "5 BDAG",
      completedProjects: 89,
      location: "New York, USA",
      bio: "Creative designer with 5+ years of experience in branding and digital design."
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
      rating: 4.8,
      reviews: 95,
      skills: ["Web Design", "Mobile UI", "Prototyping"],
      hourlyRate: "4.5 BDAG",
      completedProjects: 67,
      location: "San Francisco, USA",
      bio: "Passionate about creating user-centered designs that solve real problems."
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      avatar: "/avatars/elena.jpg",
      rating: 4.7,
      reviews: 83,
      skills: ["3D Design", "Animation", "Motion Graphics"],
      hourlyRate: "6 BDAG",
      completedProjects: 45,
      location: "Barcelona, Spain",
      bio: "Specializing in 3D modeling and motion graphics for modern brands."
    }
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDesigners = designers.filter(designer =>
    designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    designer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    designer.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs, designers, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => setShowPostJobModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDesignerRegistration(true)}
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Join as Designer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Designers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designers.length}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Based on 222 reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Jobs ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="designers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Designers ({filteredDesigners.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or post a new job.
              </p>
              <Button onClick={() => setShowPostJobModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="designers" className="space-y-4">
          {filteredDesigners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No designers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or become a designer.
              </p>
              <Button onClick={() => setShowDesignerRegistration(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Join as Designer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDesigners.map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PostJobModal
        isOpen={showPostJobModal}
        onClose={() => setShowPostJobModal(false)}
      />
      <DesignerRegistration
        isOpen={showDesignerRegistration}
        onClose={() => setShowDesignerRegistration(false)}
      />
    </div>
  );
}
