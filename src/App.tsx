
import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";

import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";

import { AuthPage } from "./components/auth/AuthPage";
import { LoginAdminPage } from "./components/auth/LoginAdminPage";

import { LandingPage } from "./components/landing/LandingPage";
import { StudentDashboard } from "./components/student/StudentDashboard";

import { ProjectsListPage } from "./components/projects/ProjectsListPage";
import { ProjectDetailPage } from "./components/projects/ProjectDetailPage";

import { ApplicationWizard } from "./components/apply/ApplicationWizard";

import { PremiumPricingPage } from "./components/premium/PremiumPricingPage";
import { PaymentCheckoutPage } from "./components/premium/PaymentCheckoutPage";

import { CompanyHiredWorkspace } from "./components/company/CompanyHiredWorkspace";

import { AdminDashboard } from "./components/admin/AdminDashboard";
import { StudentsDirectory } from "./components/admin/StudentsDirectory";
import { PartnerCompanies } from "./components/admin/PartnerCompanies";

import ChatModal from "./components/messages/ChatModal";

const AUTH_VIEWS = [
  "login_admin",
  "login_student",
  "login_company",
  "login",
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
  "certificate",
  "rating_feedback",
];

const COMPANY_VIEWS = [
  "candidate_profile",
  "rating_feedback",
  "certificate",
  "premium",
  "payment",
  "payment_checkout",
  "payment_success",
];

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
  } = useApp();

  const isAuthPage = AUTH_VIEWS.includes(currentView);
  const isGuest = !currentUser || userRole === "guest";

  const isProtectedView = [
    ...STUDENT_VIEWS,
    ...COMPANY_VIEWS,
    ...ADMIN_VIEWS,
  ].includes(currentView);

  const roleIsUnauthorized =
    (userRole === "student" && ADMIN_VIEWS.includes(currentView)) ||
    (userRole === "company" &&
      [
        ...STUDENT_VIEWS,
        ...ADMIN_VIEWS,
      ].includes(currentView)) ||
    (userRole === "admin" &&
      [
        ...STUDENT_VIEWS,
        ...COMPANY_VIEWS,
      ].includes(currentView));

  useEffect(() => {
    if (isGuest && isProtectedView) {
      setCurrentView("login");
      return;
    }

    if (!isGuest && roleIsUnauthorized) {
      if (userRole === "admin") {
        setCurrentView("admin_dashboard");
      } else if (userRole === "company") {
        setCurrentView("candidate_profile");
      } else {
        setCurrentView("student_dashboard");
      }
    }
  }, [
    isGuest,
    isProtectedView,
    roleIsUnauthorized,
    userRole,
    setCurrentView,
  ]);

  const renderPage = (): React.ReactNode => {
    // Jangan tampilkan halaman terproteksi ketika pengunjung
    // belum login, termasuk sebelum useEffect melakukan redirect.
    if (isGuest && isProtectedView) {
      return <AuthPage initialTab="student" />;
    }

    // Halaman yang tidak sesuai role tidak dirender.
    if (!isGuest && roleIsUnauthorized) {
      return <LandingPage />;
    }

    switch (currentView) {
      // =========================
      // AUTENTIKASI
      // =========================
      case "login_admin":
        return <LoginAdminPage />;

      case "login_student":
      case "login":
        return <AuthPage initialTab="student" />;

      case "login_company":
        return <AuthPage initialTab="company" />;

      // =========================
      // LANDING PAGE
      // =========================
      case "landing":
        return <LandingPage />;

      // =========================
      // DASHBOARD MAHASISWA
      // =========================
      case "student_dashboard":
        return <StudentDashboard />;

      // =========================
      // DAFTAR PROYEK
      // =========================
      case "projects_list":
        return <ProjectsListPage />;

      case "projects_ad":
        return <ProjectsListPage showAdInitially={true} />;

      // =========================
      // DETAIL PROYEK
      // =========================
      case "project_detail":
        return <ProjectDetailPage />;

      // =========================
      // PENDAFTARAN PROYEK
      // =========================
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

      // =========================
      // PREMIUM DAN PEMBAYARAN
      // =========================
      case "premium":
        return <PremiumPricingPage />;

      case "payment":
      case "payment_checkout":
        return <PaymentCheckoutPage isSuccessView={false} />;

      case "payment_success":
        return <PaymentCheckoutPage isSuccessView={true} />;

      // =========================
      // WORKSPACE PERUSAHAAN
      // =========================
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

      // =========================
      // ADMIN
      // =========================
      case "admin_control":
        return <AdminDashboard initialTab="control" />;

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

      case "system_alert":
        return <LandingPage />;

      // =========================
      // HALAMAN DEFAULT
      // =========================
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">{renderPage()}</main>

      {!isAuthPage && !isGuest && <ChatModal />}

      {!isAuthPage && <Footer />}
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
