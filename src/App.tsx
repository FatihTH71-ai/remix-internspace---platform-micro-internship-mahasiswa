
import React, { useEffect } from "react";

import {
  AppProvider,
  useApp,
  getViewFromPath,
  getPathFromView,
} from "./context/AppContext";

// COMMON
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

// AUTH
import { AuthPage } from "./components/auth/AuthPage";
import { LoginAdminPage } from "./components/auth/LoginAdminPage";
import {
  ForgotPasswordPage,
  RegistrationPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "./components/auth/AccountActionPages";

// LANDING
import { LandingPage } from "./components/landing/LandingPage";

// STUDENT
import { StudentDashboard } from "./components/student/StudentDashboard";

// PROJECTS
import { ProjectsListPage } from "./components/projects/ProjectsListPage";
import { ProjectDetailPage } from "./components/projects/ProjectDetailPage";

// APPLICATION
import { ApplicationWizard } from "./components/apply/ApplicationWizard";

// PREMIUM
import { PremiumPricingPage } from "./components/premium/PremiumPricingPage";
import { PaymentCheckoutPage } from "./components/premium/PaymentCheckoutPage";

// COMPANY
import CompanyDashboard from "./components/company/CompanyDashboard";
import { CompanyHiredWorkspace } from "./components/company/CompanyHiredWorkspace";

// ADMIN
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminValidationsPage } from "./components/admin/AdminValidationsPage";
import { StudentsDirectory } from "./components/admin/StudentsDirectory";
import { PartnerCompanies } from "./components/admin/PartnerCompanies";

// MESSAGES
import ChatModal from "./components/messages/ChatModal";

const AUTH_VIEWS = [
  "login_admin",
  "login_student",
  "login_company",
  "login",
  "register_student",
  "register_company",
  "forgot_password",
  "reset_password",
  "verify_email",
];

const STUDENT_VIEWS = [
  "student_dashboard",
  "projects_list",
  "projects_ad",
  "project_detail",
  "application_wizard",
  "apply_step1",
  "apply_step2",
  "apply_step3",
  "apply_success",
];

const COMPANY_VIEWS = [
  "company_dashboard",
  "candidate_profile",
  "rating_feedback",
  "certificate",
];

const PREMIUM_VIEWS = ["premium", "payment", "payment_checkout", "payment_success"];

const ADMIN_VIEWS = [
  "admin_control",
  "admin_dashboard",
  "students_directory",
  "invite_student",
  "partner_companies",
];

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    userRole,
    authReady,
  } = useApp();

  const isGuest = !currentUser || userRole === "guest";

  const isAuthPage =
    AUTH_VIEWS.includes(currentView) ||
    (isGuest && ADMIN_VIEWS.includes(currentView));
  const hasOwnAdminShell = currentView === "admin_control" || currentView === "students_directory" || currentView === "invite_student";
  const isLanding = currentView === "landing";

  const isProtectedView = [
    ...STUDENT_VIEWS,
    ...COMPANY_VIEWS,
    ...PREMIUM_VIEWS,
    ...ADMIN_VIEWS,
  ].includes(currentView);

  const roleIsUnauthorized =
    (userRole === "student" &&
      [...COMPANY_VIEWS, ...ADMIN_VIEWS].includes(currentView)) ||
    (userRole === "company" &&
      [...STUDENT_VIEWS, ...ADMIN_VIEWS].includes(currentView)) ||
    (userRole === "admin" &&
      [...STUDENT_VIEWS, ...COMPANY_VIEWS, ...PREMIUM_VIEWS].includes(currentView));

  // BROWSER BACK / FORWARD
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentView]);

  // PROTEKSI ROLE
  useEffect(() => {
    if (!authReady) return;
    if (isGuest && isProtectedView) {
      setCurrentView(
        ADMIN_VIEWS.includes(currentView) ? "login_admin" : "login"
      );
      return;
    }

    if (!isGuest && roleIsUnauthorized) {
      if (userRole === "admin") {
        setCurrentView("admin_dashboard");
      } else if (userRole === "company") {
        setCurrentView("company_dashboard");
      } else {
        setCurrentView("student_dashboard");
      }
    }
  }, [
    currentView,
    authReady,
    isGuest,
    isProtectedView,
    roleIsUnauthorized,
    userRole,
    setCurrentView,
  ]);

  // URL SYNC
  useEffect(() => {
    const targetPath = getPathFromView(currentView);
    const currentPath =
      window.location.pathname.replace(/\/+$/, "") || "/";

    if (targetPath && currentPath !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [currentView]);

  const renderPage = (): React.ReactNode => {
    if (!authReady && isProtectedView) {
      return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading your session…</div>;
    }

    if (isGuest && ADMIN_VIEWS.includes(currentView)) {
      return <LoginAdminPage />;
    }

    if (isGuest && isProtectedView) {
      return <AuthPage initialTab="student" />;
    }

    if (!isGuest && roleIsUnauthorized) {
      if (userRole === "company") {
        return <CompanyDashboard />;
      }

      if (userRole === "admin") {
        return <AdminDashboard initialTab="dashboard" />;
      }

      return <StudentDashboard />;
    }

    switch (currentView) {
      // AUTH
      case "login_admin":
        return <LoginAdminPage />;

      case "login_student":
      case "login":
        return <AuthPage initialTab="student" />;

      case "login_company":
        return <AuthPage initialTab="company" />;

      case "register_student":
        return <RegistrationPage role="student" />;

      case "register_company":
        return <RegistrationPage role="company" />;

      case "forgot_password":
        return <ForgotPasswordPage />;

      case "reset_password":
        return <ResetPasswordPage />;

      case "verify_email":
        return <VerifyEmailPage />;

      // LANDING
      case "landing":
        return <LandingPage />;

      // STUDENT
      case "student_dashboard":
        return <StudentDashboard />;

      // PROJECTS
      case "projects_list":
        return <ProjectsListPage />;

      case "projects_ad":
        return <ProjectsListPage showAdInitially={true} />;

      case "project_detail":
        return <ProjectDetailPage />;

      // APPLICATION
      case "application_wizard":
      case "apply_step1":
        return (
          <ApplicationWizard currentStepView="apply_step1" />
        );

      case "apply_step2":
        return (
          <ApplicationWizard currentStepView="apply_step2" />
        );

      case "apply_step3":
        return (
          <ApplicationWizard currentStepView="apply_step3" />
        );

      case "apply_success":
        return (
          <ApplicationWizard currentStepView="apply_success" />
        );

      // COMPANY DASHBOARD
      case "company_dashboard":
        return <CompanyDashboard />;

      // COMPANY WORKSPACE
      case "candidate_profile":
        return (
          <CompanyHiredWorkspace initialViewMode="profile" />
        );

      case "certificate":
        return (
          <CompanyHiredWorkspace initialViewMode="certificate" />
        );

      case "rating_feedback":
        return (
          <CompanyHiredWorkspace initialViewMode="rating" />
        );

      // PREMIUM / PAYMENT
      case "premium":
        return <PremiumPricingPage />;

      case "payment":
      case "payment_checkout":
        return <PaymentCheckoutPage isSuccessView={false} />;

      case "payment_success":
        return <PaymentCheckoutPage isSuccessView={true} />;

      // ADMIN
      case "admin_control":
        return <AdminValidationsPage />;

      case "admin_dashboard":
        return <AdminDashboard initialTab="dashboard" />;

      case "students_directory":
        return <StudentsDirectory />;

      case "invite_student":
        return (
          <StudentsDirectory showInviteModalInitially={true} />
        );

      case "partner_companies":
        return <PartnerCompanies />;

      // SYSTEM
      case "system_alert":
        return <LandingPage />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {!isAuthPage && !hasOwnAdminShell && !isLanding && <Navbar />}

      <main className="flex-1">
        {renderPage()}
      </main>

      {!isAuthPage && !hasOwnAdminShell && !isGuest && <ChatModal />}

      {!isAuthPage && !hasOwnAdminShell && !isLanding && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
