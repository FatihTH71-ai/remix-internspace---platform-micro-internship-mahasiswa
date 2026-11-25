import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiJson, apiRequest, apiUpload, ApiClientError } from "../lib/api";

export type UserRole = "student" | "company" | "admin" | "guest";
export type Language = "id" | "en";

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
  phone?: string;
  isPremium?: boolean;
  premiumUntil?: string | null;
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
  durationWeeks?: number;
  location: string;
  stipend: string;
  isFeatured?: boolean;
  skillMatchPercent?: number;
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
  fileUrl?: string;
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
  isPriority?: boolean;
  skillMatchPercent?: number;
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

export interface StudentRegistrationInput {
  role: "student";
  name: string;
  email: string;
  password: string;
  university: string;
  major: string;
  nim?: string;
  phone: string;
}

export interface CompanyRegistrationInput {
  role: "company";
  name: string;
  email: string;
  password: string;
  companyName: string;
  industry: string;
  website?: string;
}

export type RegistrationInput = StudentRegistrationInput | CompanyRegistrationInput;
export type PremiumPlanId = "student_premium" | "company_premium";
export type PaymentMethod = "bank_transfer" | "ewallet";

export interface PendingPaymentPlan {
  id: PremiumPlanId;
  name: string;
  type: "student" | "company";
}

export interface PaymentTransaction {
  id: string;
  plan: PremiumPlanId;
  planName: string;
  amount: number;
  method: PaymentMethod;
  proofFileId?: string | null;
  proofUrl?: string | null;
  status: "pending" | "verified" | "rejected";
  createdAt?: string;
  verifiedAt?: string | null;
}

interface AppContextType {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  authReady: boolean;
  apiError: string | null;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projectsLoading: boolean;
  projectsError: string | null;
  selectedProjectId: string | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  applicationsLoading: boolean;
  applicationsError: string | null;
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
  pendingPaymentPlan: PendingPaymentPlan | null;
  setPendingPaymentPlan: React.Dispatch<React.SetStateAction<PendingPaymentPlan | null>>;
  latestTransaction: PaymentTransaction | null;
  loginWithPassword: (email: string, password: string, role: UserRole) => Promise<void>;
  registerAccount: (input: RegistrationInput) => Promise<void>;
  logout: () => Promise<void>;
  submitApplication: (input: SubmitApplicationInput) => Promise<Application>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  submitRating: (id: string, rating: RatingInput) => void;
  sendMessage: (recipientName: string, text: string) => void;
  approveProject: (id: string) => Promise<void>;
  rejectProject: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, "id" | "createdAt" | "status">) => Promise<Project>;
  createTransaction: (
    plan: PremiumPlanId,
    method: PaymentMethod,
    proof: File
  ) => Promise<PaymentTransaction>;
  reviewTransaction: (id: string, status: "verified" | "rejected") => Promise<void>;
  clearAlerts: () => void;
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
  register_student: "/register/student",
  register_company: "/register/company",
  forgot_password: "/forgot-password",
  reset_password: "/reset-password",
  verify_email: "/verify-email",
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

export function getPathFromView(view: string): string {
  return VIEW_PATHS[view] ?? "/";
}

export function getViewFromPath(path: string): string {
  const cleanPath = path.replace(/\/+$/, "") || "/";
  const found = Object.entries(VIEW_PATHS).find(([, routePath]) => routePath === cleanPath);
  return found?.[0] ?? "landing";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

export function durationInWeeks(duration: string): number {
  const match = duration.match(/^\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*(week|weeks|minggu|month|months|bulan)\s*$/i);
  if (!match) throw new Error("Enter a project duration in weeks or months.");
  const amount = Number(match[2] ?? match[1]);
  const unit = match[3].toLowerCase();
  return unit.startsWith("month") || unit === "bulan" ? amount * 4 : amount;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState(() => getViewFromPath(window.location.pathname));
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("id");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AppMessage[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<CurrentUser | null>(null);
  const [pendingPaymentPlan, setPendingPaymentPlan] = useState<PendingPaymentPlan | null>(null);
  const [latestTransaction, setLatestTransaction] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<{ user: CurrentUser }>("/auth/me")
      .then(({ user }) => {
        if (!active) return;
        setCurrentUser(user);
        setUserRole(user.role);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiClientError && error.status === 401) return;
        setApiError(errorMessage(error));
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!authReady) {
      return () => {
        active = false;
      };
    }

    if (!currentUser) {
      setProjects([]);
      setProjectsError(null);
      setProjectsLoading(false);
      return () => {
        active = false;
      };
    }

    setProjects([]);
    setProjectsError(null);
    setProjectsLoading(true);
    const loadProjects = async () => {
      try {
        const path = currentUser.role === "student"
          ? "/projects/recommendations"
          : "/projects";
        const { projects: publicProjects } = await apiRequest<{ projects: Project[] }>(path);
        let allProjects = publicProjects;

        if (currentUser.role === "company") {
          const { projects: ownedProjects } = await apiRequest<{ projects: Project[] }>("/projects/mine");
          allProjects = [...ownedProjects, ...publicProjects.filter(
            (project) => !ownedProjects.some((owned) => owned.id === project.id)
          )];
        } else if (currentUser.role === "admin") {
          const { projects: pendingProjects } = await apiRequest<{ projects: Project[] }>("/projects/admin/pending");
          allProjects = [...pendingProjects, ...publicProjects];
        }

        if (active) setProjects(allProjects);
      } catch (error) {
        if (active) {
          setProjectsError(errorMessage(error));
          setApiError(errorMessage(error));
        }
      } finally {
        if (active) setProjectsLoading(false);
      }
    };
    void loadProjects();
    return () => {
      active = false;
    };
  }, [authReady, currentUser?.id, currentUser?.role]);

  useEffect(() => {
    let active = true;
    const loadApplications = async () => {
      if (!authReady) return;
      if (!currentUser || (currentUser.role !== "student" && currentUser.role !== "company")) {
        setApplications([]);
        setApplicationsError(null);
        setApplicationsLoading(false);
        return;
      }
      setApplications([]);
      setApplicationsError(null);
      setApplicationsLoading(true);
      try {
        const path = currentUser.role === "student" ? "/applications/mine" : "/applications/company";
        const { applications: results } = await apiRequest<{ applications: Application[] }>(path);
        if (active) setApplications(results);
      } catch (error) {
        if (active) {
          setApplicationsError(errorMessage(error));
          setApiError(errorMessage(error));
        }
      } finally {
        if (active) setApplicationsLoading(false);
      }
    };
    void loadApplications();
    return () => {
      active = false;
    };
  }, [authReady, currentUser?.id, currentUser?.role]);

  const loginWithPassword = useCallback(async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    const { user } = await apiJson<{ user: CurrentUser }>("/auth/login", "POST", {
      email,
      password,
      role,
    });
    setCurrentUser(user);
    setUserRole(user.role);
    setApiError(null);
    setCurrentView(user.role === "admin"
      ? "admin_dashboard"
      : user.role === "company"
        ? "company_dashboard"
        : "student_dashboard");
  }, []);

  const registerAccount = useCallback(async (input: RegistrationInput) => {
    await apiJson<{ message: string }>("/auth/register", "POST", input);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } catch (error) {
      setApiError(errorMessage(error));
    } finally {
      setCurrentUser(null);
      setUserRole("guest");
      setProjects([]);
      setProjectsLoading(false);
      setProjectsError(null);
      setApplications([]);
      setApplicationsLoading(false);
      setApplicationsError(null);
      setIsChatOpen(false);
      setActiveChatRecipient(null);
      setSelectedApplicationId(null);
      setCurrentView("landing");
    }
  }, []);

  const submitApplication = useCallback(async (
    input: SubmitApplicationInput
  ): Promise<Application> => {
    const { application } = await apiJson<{ application: Application }>("/applications", "POST", {
      projectId: input.projectId,
      semester: input.semester,
      motivation: input.motivation,
      relevantExperience: input.relevantExperience,
      portfolioUrl: input.portfolioUrl,
      linkedinUrl: input.linkedinUrl,
    });
    setApplications((previous) => [application, ...previous]);
    setSelectedApplicationId(application.id);
    return application;
  }, []);

  const updateApplicationStatus = useCallback(async (
    id: string,
    status: ApplicationStatus
  ) => {
    await apiJson(`/applications/${encodeURIComponent(id)}/status`, "PATCH", { status });
    setApplications((previous) => previous.map((application) =>
      application.id === id ? { ...application, status } : application
    ));
  }, []);

  const submitRating = useCallback((id: string, rating: RatingInput) => {
    setApplications((previous) => previous.map((application) =>
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
    ));
  }, []);

  const sendMessage = useCallback((recipientName: string, text: string) => {
    const cleanText = text.trim();
    if (!cleanText || !currentUser) return;

    const recipient = activeChatRecipient ?? {
      id: `contact-${recipientName.toLowerCase().replace(/\s+/g, "-")}`,
      name: recipientName,
      email: "",
      role: "company" as UserRole,
    };
    const message: AppMessage = {
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
    setMessages((previous) => [...previous, message]);
  }, [activeChatRecipient, currentUser]);

  const approveProject = useCallback(async (id: string) => {
    await apiJson(`/projects/${encodeURIComponent(id)}/approval`, "PATCH", { status: "approved" });
    setProjects((previous) => previous.map((project) =>
      project.id === id ? { ...project, status: "approved" } : project
    ));
  }, []);

  const rejectProject = useCallback(async (id: string) => {
    await apiJson(`/projects/${encodeURIComponent(id)}/approval`, "PATCH", { status: "rejected" });
    setProjects((previous) => previous.map((project) =>
      project.id === id ? { ...project, status: "rejected" } : project
    ));
  }, []);

  const addProject = useCallback(async (
    project: Omit<Project, "id" | "createdAt" | "status">
  ): Promise<Project> => {
    const { project: saved } = await apiJson<{ project: Project }>("/projects", "POST", {
      title: project.title,
      category: project.category,
      description: project.description,
      durationWeeks: project.durationWeeks ?? durationInWeeks(project.duration),
      location: project.location,
      stipend: project.stipend,
      skillsRequired: project.skillsRequired,
    });
    setProjects((previous) => [saved, ...previous]);
    return saved;
  }, []);

  const createTransaction = useCallback(async (
    plan: PremiumPlanId,
    method: PaymentMethod,
    proof: File
  ): Promise<PaymentTransaction> => {
    const { transaction } = await apiJson<{ transaction: PaymentTransaction }>(
      "/transactions",
      "POST",
      { plan, method }
    );
    const proofResult = await apiUpload<{ proofFileId: string; status: "pending" }>(
      `/transactions/${encodeURIComponent(transaction.id)}/proof`,
      proof
    );
    const completed = {
      ...transaction,
      proofFileId: proofResult.proofFileId,
      status: "pending" as const,
    };
    setLatestTransaction(completed);
    return completed;
  }, []);

  const reviewTransaction = useCallback(async (
    id: string,
    status: "verified" | "rejected"
  ) => {
    await apiJson(`/transactions/${encodeURIComponent(id)}/review`, "PATCH", { status });
    setLatestTransaction((previous) => previous?.id === id
      ? { ...previous, status }
      : previous);
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);
  const getMyApplications = useCallback(
    () => currentUser
      ? applications.filter((application) => application.studentId === currentUser.id)
      : [],
    [applications, currentUser]
  );
  const getCompanyProjects = useCallback(
    () => currentUser?.role === "company"
      ? projects.filter((project) => project.companyId === currentUser.id)
      : [],
    [projects, currentUser]
  );
  const getCompanyApplications = useCallback(
    () => currentUser?.role === "company"
      ? applications.filter((application) => application.companyId === currentUser.id)
      : [],
    [applications, currentUser]
  );

  const value = useMemo<AppContextType>(() => ({
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    currentUser,
    setCurrentUser,
    authReady,
    apiError,
    language,
    setLanguage,
    projects,
    setProjects,
    projectsLoading,
    projectsError,
    selectedProjectId,
    setSelectedProjectId,
    applications,
    setApplications,
    applicationsLoading,
    applicationsError,
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
    latestTransaction,
    loginWithPassword,
    registerAccount,
    logout,
    submitApplication,
    updateApplicationStatus,
    submitRating,
    sendMessage,
    approveProject,
    rejectProject,
    addProject,
    createTransaction,
    reviewTransaction,
    clearAlerts,
    getMyApplications,
    getCompanyProjects,
    getCompanyApplications,
  }), [
    currentView,
    userRole,
    currentUser,
    authReady,
    apiError,
    language,
    projects,
    projectsLoading,
    projectsError,
    selectedProjectId,
    applications,
    applicationsLoading,
    applicationsError,
    selectedApplicationId,
    messages,
    alerts,
    isChatOpen,
    activeChatRecipient,
    pendingPaymentPlan,
    latestTransaction,
    loginWithPassword,
    registerAccount,
    logout,
    submitApplication,
    updateApplicationStatus,
    submitRating,
    sendMessage,
    approveProject,
    rejectProject,
    addProject,
    createTransaction,
    reviewTransaction,
    clearAlerts,
    getMyApplications,
    getCompanyProjects,
    getCompanyApplications,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp harus digunakan di dalam komponen AppProvider.");
  return context;
}
