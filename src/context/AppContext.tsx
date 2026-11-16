
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type UserRole = "student" | "company" | "admin" | "guest";

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

export type ProjectStatus = "pending" | "approved" | "rejected";

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

interface AppContextType {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedProjectId: string | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  selectedApplicationId: string | null;
  setSelectedApplicationId: React.Dispatch<React.SetStateAction<string | null>>;
  messages: AppMessage[];
  setMessages: React.Dispatch<React.SetStateAction<AppMessage[]>>;
  alerts: SystemAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<SystemAlert[]>>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeChatRecipient: CurrentUser | null;
  setActiveChatRecipient: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  loginAs: (user: CurrentUser) => void;
  logout: () => void;
  submitApplication: (input: SubmitApplicationInput) => Application | null;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  submitRating: (id: string, rating: RatingInput) => void;
  sendMessage: (recipientName: string, text: string) => void;
  approveProject: (id: string) => void;
  rejectProject: (id: string) => void;
  addProject: (project: Omit<Project, "id" | "createdAt" | "status">) => void;
  clearAlerts: () => void;
  getSkillMatch: (project: Project, skills?: string[]) => number;
  getMyApplications: () => Application[];
  getCompanyProjects: () => Project[];
  getCompanyApplications: () => Application[];
}

const VIEW_PATHS: Record<string, string> = {
  landing: "/",
  login: "/login",
  login_student: "/login/student",
  login_company: "/login/company",
  login_admin: "/admin",
  student_dashboard: "/student/dashboard",
  projects_list: "/projects",
  projects_ad: "/projects/ad",
  project_detail: "/project/detail",
  application_wizard: "/apply",
  apply_step1: "/apply/step-1",
  apply_step2: "/apply/step-2",
  apply_step3: "/apply/step-3",
  apply_success: "/apply/success",
  company_dashboard: "/company/dashboard",
  candidate_profile: "/company/candidates",
  certificate: "/company/certificate",
  rating_feedback: "/company/rating",
  premium: "/premium",
  payment: "/payment",
  payment_checkout: "/payment/checkout",
  payment_success: "/payment/success",
  admin_control: "/admin/control",
  admin_dashboard: "/admin/dashboard",
  students_directory: "/admin/students",
  invite_student: "/admin/invite-student",
  partner_companies: "/admin/companies",
  system_alert: "/system-alert",
};

const ADMIN_SESSION_STORAGE_KEY = "internspace_admin_session";

export function getPathFromView(view: string): string {
  return VIEW_PATHS[view] ?? "/";
}

export function getViewFromPath(path: string): string {
  const cleanPath = path.replace(/\/+$/, "") || "/";
  const found = Object.entries(VIEW_PATHS).find(
    ([, routePath]) => routePath === cleanPath
  );
  return found?.[0] ?? "landing";
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
    category: "Design",
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
    category: "Marketing",
    description:
      "Melakukan riset pasar, analisis SEO, dan menyusun laporan performa pemasaran digital.",
    skillsRequired: ["Research", "SEO", "Analytics"],
    duration: "3 bulan",
    location: "Remote",
    stipend: "Rp1.200.000/bulan",
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [persistedAdmin] = useState<CurrentUser | null>(() => {
    const storedSession = window.localStorage.getItem(
      ADMIN_SESSION_STORAGE_KEY
    );

    if (!storedSession) return null;

    try {
      const user = JSON.parse(storedSession) as CurrentUser;
      return user.role === "admin" ? user : null;
    } catch {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      return null;
    }
  });
  const [currentView, setCurrentView] = useState(() =>
    persistedAdmin && getViewFromPath(window.location.pathname) === "login_admin"
      ? "admin_dashboard"
      : getViewFromPath(window.location.pathname)
  );
  const [userRole, setUserRole] = useState<UserRole>(
    persistedAdmin?.role ?? "guest"
  );
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(persistedAdmin);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialAlerts);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] =
    useState<CurrentUser | null>(null);

  const loginAs = useCallback((user: CurrentUser) => {
    setCurrentUser(user);
    setUserRole(user.role);

    if (user.role === "admin") {
      window.localStorage.setItem(
        ADMIN_SESSION_STORAGE_KEY,
        JSON.stringify(user)
      );
      setCurrentView("admin_dashboard");
    } else if (user.role === "company") {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      setCurrentView("company_dashboard");
    } else {
      window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      setCurrentView("student_dashboard");
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    setCurrentUser(null);
    setUserRole("guest");
    setIsChatOpen(false);
    setActiveChatRecipient(null);
    setSelectedApplicationId(null);
    setCurrentView("landing");
  }, []);

  const submitApplication = useCallback(
    (input: SubmitApplicationInput): Application | null => {
      if (!currentUser || currentUser.role !== "student") return null;

      const project = projects.find((item) => item.id === input.projectId);
      if (!project) return null;

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
        id: `application-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
          application.id === id ? { ...application, status } : application
        )
      );
    },
    []
  );

  const submitRating = useCallback((id: string, rating: RatingInput) => {
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
  }, []);

  const sendMessage = useCallback(
    (recipientName: string, text: string) => {
      const cleanText = text.trim();
      if (!cleanText || !currentUser) return;

      const recipient = activeChatRecipient ?? {
        id: `contact-${recipientName.toLowerCase().replace(/\s+/g, "-")}`,
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
      if (!currentUser || currentUser.role !== "company") return;

      const newProject: Project = {
        ...project,
        company: currentUser.companyName || currentUser.name,
        companyId: currentUser.id,
        id: `project-${Date.now()}`,
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
      const studentSkills = (skills ?? currentUser?.skills ?? []).map(
        (skill) => skill.trim().toLowerCase()
      );

      if (project.skillsRequired.length === 0) return 100;
      if (studentSkills.length === 0) return 0;

      const matches = project.skillsRequired.filter((required) =>
        studentSkills.includes(required.trim().toLowerCase())
      ).length;

      return Math.round((matches / project.skillsRequired.length) * 100);
    },
    [currentUser]
  );

  const getMyApplications = useCallback(() => {
    if (!currentUser) return [];
    return applications.filter(
      (application) => application.studentId === currentUser.id
    );
  }, [applications, currentUser]);

  const getCompanyProjects = useCallback(() => {
    if (!currentUser || currentUser.role !== "company") return [];

    return projects.filter(
      (project) =>
        project.companyId === currentUser.id ||
        (!project.companyId &&
          project.company === (currentUser.companyName || currentUser.name))
    );
  }, [projects, currentUser]);

  const getCompanyApplications = useCallback(() => {
    if (!currentUser || currentUser.role !== "company") return [];

    const companyProjectIds = getCompanyProjects().map((project) => project.id);

    return applications.filter(
      (application) =>
        application.companyId === currentUser.id ||
        companyProjectIds.includes(application.projectId)
    );
  }, [applications, currentUser, getCompanyProjects]);

  const value = useMemo<AppContextType>(
    () => ({
      currentView,
      setCurrentView,
      userRole,
      setUserRole,
      currentUser,
      setCurrentUser,
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
      getCompanyProjects,
      getCompanyApplications,
    }),
    [
      currentView,
      userRole,
      currentUser,
      projects,
      selectedProjectId,
      applications,
      selectedApplicationId,
      messages,
      alerts,
      isChatOpen,
      activeChatRecipient,
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
      getCompanyProjects,
      getCompanyApplications,
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
    throw new Error("useApp harus digunakan di dalam komponen AppProvider.");
  }

  return context;
}
