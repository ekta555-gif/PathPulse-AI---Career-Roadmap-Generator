export interface UserProfile {
  name: string;
  department: string;
  targetPosition: string;
  weeklyHours: number;
  totalDurationMonths: number;
  resumeText: string;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
  description: string;
}

export interface RoadmapWeek {
  week: number;
  topic: string;
  objective: string;
  resources: Resource[];
}

export interface LearningPath {
  summary: string;
  skillGaps: string[];
  targetRole: string;
  roadmap: RoadmapWeek[];

}

