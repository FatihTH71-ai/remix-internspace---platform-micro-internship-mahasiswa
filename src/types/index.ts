export type UserRole = 'student' | 'company' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  university?: string;
  nim?: string;
  major?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  isPremium?: boolean;
  portfolioUrl?: string;
  resumeFileName?: string;
  companyName?: string;
  companyIndustry?: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  category: 'Tech & Programming' | 'Graphic & Design' | 'Video & Animation' | 'Digital Marketing' | 'Engineering';
  duration: string; // e.g., '4 weeks', '2-4 weeks', '1-2 months'
  durationCategory: '2-4 weeks' | '1-2 months' | '>2 months';
  location: string;
  stipend: string;
  type: 'Micro Internship';
  status: 'Open' | 'In Review' | 'Active' | 'Completed';
  isFeatured?: boolean;
  postedDate: string;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skillsRequired: string[];
  aboutCompany: {
    description: string;
    industry: string;
    employees: string;
    website: string;
    verified: boolean;
  };
}

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentUniversity: string;
  studentMajor: string;
  appliedDate: string;
  status: 'Submitted' | 'HR Screening' | 'In Progress' | 'Revision Pending' | 'Completed' | 'Rejected';
  progress: number; // 0 - 100
  dueDate: string;
  answers: {
    whyInterested: string;
    challengeSolved: string;
    availability: string;
  };
  deliverables?: {
    title: string;
    submittedAt: string;
    fileUrl: string;
    status: 'Pending Review' | 'Revision Requested' | 'Approved';
  }[];
  rating?: {
    quality: number;
    communication: number;
    punctuality: number;
    feedbackText: string;
    isPublic: boolean;
    ratedAt: string;
  };
  certificateId?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  status: 'Active' | 'In Review' | 'Suspended';
  registeredDate: string;
  completedProjects: number;
  avatar: string;
}

export interface CompanyRecord {
  id: string;
  name: string;
  email: string;
  industry: string;
  activeProjects: number;
  totalHired: number;
  rating: number;
  verified: boolean;
  logo: string;
  joinedDate: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  type: 'info' | 'warning' | 'success';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  avatar: string;
  text: string;
  timestamp: string;
  isUnread?: boolean;
}
