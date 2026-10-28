
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type UserRole = "student" | "company" | "admin" | "guest";
export type Language = "id" | "en";
export type ProjectStatus = "pending" | "approved" | "rejected";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
  major?: string;
  companyName?: string;
  skills?: string[];
  portfolioUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyId?: string;
  category: string;
  description: string;
  skillsRequired: string[];
  duration: string;
  location: string;
  stipend: string;
  isFeatured?: boolean;
  status?: ProjectStatus;
  createdAt?: string;
}

export type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "accepted"
  | "rejected"
  | "completed";

export interface Deliverable {
  title: string;
  submittedAt?: string;
  status: "pending" | "submitted" | "approved";
}

export interface ApplicationRating {
  quality: number;
  communication: number;
  punctuality: number;
  feedbackText: string;
  isPublic: boolean;
  submittedAt: string;
}

export interface Application {
  id: string;
  projectId: string;
  projectTitle: string;
  companyName: string;
  companyId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMajor: string;
  studentUniversity: string;
  phone: string;
  semester: string;
  motivation: string;
  relevantExperience: string;
  portfolioUrl: string;
  linkedinUrl: string;
  status: ApplicationStatus;
  submittedAt: string;
  deliverables: Deliverable[];
  rating?: ApplicationRating;
}

export interface AppMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isUnread: boolean;
}

export interface SystemAlert {
  id: string;
  title: string;
  detail: string;
  timeAgo: string;
  type?: "info" | "success" | "warning";
}

export interface SubmitApplicationInput {
  projectId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  studyProgram: string;
  semester: string;
  motivation: string;
  relevantExperience: string;
  portfolioUrl: string;
  linkedinUrl: string;
}

export interface RatingInput {
  quality: number;
  communication: number;
  punctuality: number;
  feedbackText: string;
  isPublic: boolean;
}

export interface PendingPaymentPlan {
  name: string;
  price: number;
  type: "student" | "company";
}

interface AppContextType {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<CurrentUser | null>
  >;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProjectId: string | null;
  setSelectedProjectId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  selectedApplicationId: string | null;
  setSelectedApplicationId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  messages: AppMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AppMessage[]>>;
  alerts: SystemAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<SystemAlert[]>>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeChatRecipient: CurrentUser | null;
  setActiveChatRecipient: React.Dispatch<
    React.SetStateAction<CurrentUser | null>
  >;
  pendingPaymentPlan: PendingPaymentPlan | null;
  setPendingPaymentPlan: React.Dispatch<
    React.SetStateAction<PendingPaymentPlan | null>
  >;
  loginAs: (user: CurrentUser) => void;
  logout: () => void;
  submitApplication: (
    input: SubmitApplicationInput
  ) => Application | null;
  updateApplicationStatus: (
    id: string,
    status: ApplicationStatus
  ) => void;
  submitRating: (id: string, rating: RatingInput) => void;
  sendMessage: (recipientName: string, text: string) => void;
  approveProject: (id: string) => void;
  rejectProject: (id: string) => void;
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "status">
  ) => void;
  clearAlerts: () => void;
  getSkillMatch: (project: Project, skills?: string[]) => number;
  getMyApplications: () => Application[];
}

const initialProjects: Project[] = [
  {
    id: "project-1",
    title: "Frontend Web Development",
    company: "Tech Innovation",
    companyLogo: "https://placehold.co/64x64?text=TI",
    companyId: "company-1",
    category: "Technology",
    description:
      "Membantu mengembangkan antarmuka web responsif menggunakan React, TypeScript, dan Tailwind CSS.",
    skillsRequired: ["React", "TypeScript", "Tailwind CSS"],
    duration: "3 bulan",
    location: "Remote",
    stipend: "Rp1.500.000/bulan",
    isFeatured: true,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    title: "Graphic Design Campaign",
    company: "Creative Studio",
    companyLogo: "https://placehold.co/64x64?text=CS",
    companyId: "company-2",
    category: "Graphic & Design",
    description:
      "Membuat aset visual kampanye digital, konten media sosial, dan materi promosi.",
    skillsRequired: ["Figma", "Canva", "Branding"],
    duration: "2 bulan",
    location: "Hybrid",
    stipend: "Rp1.000.000/bulan",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-3",
    title: "Digital Marketing Research",
    company: "Growth Lab",
    companyLogo: "https://placehold.co/64x64?text=GL",
    companyId: "company-3",
    category: "Digital Marketing",
    description:
      "Melakukan riset pasar, analisis SEO, dan menyusun laporan performa pemasaran digital.",
    skillsRequired: ["Research", "SEO", "Analytics"],
    duration: "3 bulan",
    location: "Remote",
    stipend: "Rp1.200.000/bulan",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-detikcom",
    title: "Digital Media & Content Internship",
    company: "detikcom",
    companyLogo: "https://placehold.co/96x96?text=detikcom",
    companyId: "company-detikcom",
    category: "Digital Marketing",
    description:
      "Contoh peluang untuk mempelajari media digital, penulisan konten, SEO, dan riset jurnalistik data. Periksa informasi serta persyaratan sebelum mengirim lamaran.",
    skillsRequired: [
      "Content Writing",
      "SEO",
      "Digital Media",
      "Research",
    ],
    duration: "4 minggu",
    location: "Hybrid",
    stipend: "Belum ditentukan",
    isFeatured: true,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];

const initialAlerts: SystemAlert[] = [
  {
    id: "alert-welcome",
    title: "Selamat datang di InternSpace",
    detail: "Lengkapi profil untuk menemukan proyek yang sesuai.",
    timeAgo: "Baru saja",
    type: "info",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentView, setCurrentView] = useState("landing");
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [language, setLanguage] = useState<Language>("id");

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] =
    useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string | null>(null);

  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialAlerts);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] =
    useState<CurrentUser | null>(null);

  const [pendingPaymentPlan, setPendingPaymentPlan] =
    useState<PendingPaymentPlan | null>(null);

  const loginAs = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    setUserRole(user.role);

    if (user.role === "admin") {
      setCurrentView("admin_dashboard");
    } else if (user.role === "company") {
      setCurrentView("candidate_profile");
    } else {
      setCurrentView("student_dashboard");
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserRole("guest");
    setIsChatOpen(false);
    setActiveChatRecipient(null);
    setSelectedApplicationId(null);
    setSelectedProjectId(null);
    setCurrentView("landing");
  }, []);

  const submitApplication = useCallback(
    (input: SubmitApplicationInput): Application | null => {
      if (!currentUser || currentUser.role !== "student") {
        return null;
      }

      const project = projects.find(
        (item) => item.id === input.projectId
      );

      if (!project || project.status === "rejected") {
        return null;
      }

      const duplicate = applications.find(
        (item) =>
          item.projectId === project.id &&
          item.studentId === currentUser.id
      );

      if (duplicate) {
        setSelectedApplicationId(duplicate.id);
        return null;
      }

      const application: Application = {
        id: `application-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        projectId: project.id,
        projectTitle: project.title,
        companyName: project.company,
        companyId: project.companyId,
        studentId: currentUser.id,
        studentName: input.fullName.trim(),
        studentEmail: input.email.trim(),
        studentMajor: input.studyProgram.trim(),
        studentUniversity: input.university.trim(),
        phone: input.phone.trim(),
        semester: input.semester,
        motivation: input.motivation.trim(),
        relevantExperience: input.relevantExperience.trim(),
        portfolioUrl: input.portfolioUrl.trim(),
        linkedinUrl: input.linkedinUrl.trim(),
        status: "submitted",
        submittedAt: new Date().toISOString(),
        deliverables: [],
      };

      setApplications((previous) => [application, ...previous]);
      setSelectedApplicationId(application.id);

      setAlerts((previous) => [
        {
          id: `alert-${Date.now()}`,
          title: "Lamaran berhasil dikirim",
          detail: `Lamaran untuk ${project.title} telah tercatat.`,
          timeAgo: "Baru saja",
          type: "success",
        },
        ...previous,
      ]);

      return application;
    },
    [applications, currentUser, projects]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setApplications((previous) =>
        previous.map((application) =>
          application.id === id
            ? { ...application, status }
            : application
        )
      );
    },
    []
  );

  const submitRating = useCallback(
    (id: string, rating: RatingInput) => {
      setApplications((previous) =>
        previous.map((application) =>
          application.id === id
            ? {
                ...application,
                status: "completed",
                rating: {
                  ...rating,
                  feedbackText: rating.feedbackText.trim(),
                  submittedAt: new Date().toISOString(),
                },
              }
            : application
        )
      );
    },
    []
  );

  const sendMessage = useCallback(
    (recipientName: string, text: string) => {
      const cleanText = text.trim();
      if (!cleanText || !currentUser) return;

      const recipient = activeChatRecipient ?? {
        id: `contact-${recipientName
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        name: recipientName,
        email: "",
        role: "company" as UserRole,
      };

      const newMessage: AppMessage = {
        id: `message-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: recipient.id,
        recipientName: recipient.name,
        avatar: currentUser.avatar,
        text: cleanText,
        timestamp: new Date().toISOString(),
        isUnread: false,
      };

      setMessages((previous) => [...previous, newMessage]);
    },
    [activeChatRecipient, currentUser]
  );

  const approveProject = useCallback((id: string) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === id ? { ...project, status: "approved" } : project
      )
    );

    setAlerts((previous) => [
      {
        id: `alert-${Date.now()}`,
        title: "Proyek disetujui",
        detail: `Proyek dengan ID ${id} telah disetujui.`,
        timeAgo: "Baru saja",
        type: "success",
      },
      ...previous,
    ]);
  }, []);

  const rejectProject = useCallback((id: string) => {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === id ? { ...project, status: "rejected" } : project
      )
    );
  }, []);

  const addProject = useCallback(
    (project: Omit<Project, "id" | "createdAt" | "status">) => {
      const newProject: Project = {
        ...project,
        id: `project-${Date.now()}`,
        companyId: currentUser?.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setProjects((previous) => [newProject, ...previous]);
    },
    [currentUser]
  );

  const clearAlerts = useCallback(() => setAlerts([]), []);

  const getSkillMatch = useCallback(
    (project: Project, skills?: string[]) => {
      const studentSkills = (
        skills ??
        currentUser?.skills ??
        []
      ).map((skill) => skill.trim().toLowerCase());

      if (project.skillsRequired.length === 0) return 100;
      if (studentSkills.length === 0) return 0;

      const matches = project.skillsRequired.filter((required) =>
        studentSkills.includes(required.trim().toLowerCase())
      ).length;

      return Math.round(
        (matches / project.skillsRequired.length) * 100
      );
    },
    [currentUser]
  );

  const getMyApplications = useCallback(() => {
    if (!currentUser) return [];

    return applications.filter(
      (application) => application.studentId === currentUser.id
    );
  }, [applications, currentUser]);

  const value = useMemo<AppContextType>(
    () => ({
      currentView,
      setCurrentView,
      userRole,
      setUserRole,
      currentUser,
      setCurrentUser,
      language,
      setLanguage,
      projects,
      setProjects,
      selectedProjectId,
      setSelectedProjectId,
      applications,
      setApplications,
      selectedApplicationId,
      setSelectedApplicationId,
      messages,
      setMessages,
      alerts,
      setAlerts,
      isChatOpen,
      setIsChatOpen,
      activeChatRecipient,
      setActiveChatRecipient,
      pendingPaymentPlan,
      setPendingPaymentPlan,
      loginAs,
      logout,
      submitApplication,
      updateApplicationStatus,
      submitRating,
      sendMessage,
      approveProject,
      rejectProject,
      addProject,
      clearAlerts,
      getSkillMatch,
      getMyApplications,
    }),
    [
      currentView,
      userRole,
      currentUser,
      language,
      projects,
      selectedProjectId,
      applications,
      selectedApplicationId,
      messages,
      alerts,
      isChatOpen,
      activeChatRecipient,
      pendingPaymentPlan,
      loginAs,
      logout,
      submitApplication,
      updateApplicationStatus,
      submitRating,
      sendMessage,
      approveProject,
      rejectProject,
      addProject,
      clearAlerts,
      getSkillMatch,
      getMyApplications,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp harus digunakan di dalam komponen AppProvider."
    );
  }

  return context;
}
