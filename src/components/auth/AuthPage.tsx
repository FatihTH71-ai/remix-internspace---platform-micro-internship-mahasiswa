
import React, { useState } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type LoginRole = "student" | "company";

interface AuthPageProps {
  initialTab?: LoginRole;
}

const AuthPage: React.FC<AuthPageProps> = ({
  initialTab = "student",
}) => {
  const {
    loginAs,
    setCurrentView,
    language,
    setLanguage,
  } = useApp();

  const [activeTab, setActiveTab] =
    useState<LoginRole>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isId = language === "id";

  const content = {
    welcome: isId
      ? "Selamat datang kembali!"
      : "Welcome back!",
    subtitle: isId
      ? "Masuk dan lanjutkan perjalanan kariermu bersama InternSpace."
      : "Sign in and continue your career journey with InternSpace.",
    student: isId ? "Mahasiswa" : "Student",
    company: isId ? "Perusahaan" : "Company",
    studentDesc: isId
      ? "Temukan peluang magang terbaik."
      : "Discover the best internship opportunities.",
    companyDesc: isId
      ? "Temukan talenta terbaik untuk timmu."
      : "Find the best talent for your team.",
    email: isId ? "Alamat Email" : "Email Address",
    password: isId ? "Kata Sandi" : "Password",
    emailPlaceholder: isId
      ? "nama@email.com"
      : "name@email.com",
    passwordPlaceholder: isId
      ? "Masukkan kata sandi"
      : "Enter your password",
    forgot: isId ? "Lupa kata sandi?" : "Forgot password?",
    login: isId ? "Masuk ke Akun" : "Sign In",
    processing: isId ? "Memproses..." : "Processing...",
    noAccount: isId
      ? "Belum memiliki akun?"
      : "Don't have an account?",
    register: isId ? "Daftar sekarang" : "Register now",
    required: isId
      ? "Email dan kata sandi wajib diisi."
      : "Email and password are required.",
    invalidEmail: isId
      ? "Masukkan alamat email yang valid."
      : "Please enter a valid email address.",
    failed: isId
      ? "Login gagal. Silakan coba kembali."
      : "Login failed. Please try again.",
    footer: isId
      ? "Dengan masuk, kamu menyetujui ketentuan penggunaan InternSpace."
      : "By signing in, you agree to the InternSpace terms of use.",
    heroTitle: isId
      ? "Bangun masa depanmu bersama InternSpace."
      : "Build your future with InternSpace.",
    heroDesc: isId
      ? "Hubungkan potensimu dengan peluang magang yang tepat. Mulai perjalanan profesionalmu hari ini."
      : "Connect your potential with the right internship opportunities. Start your professional journey today.",
    feature1: isId
      ? "Peluang magang dari berbagai perusahaan"
      : "Internship opportunities from various companies",
    feature2: isId
      ? "Bangun pengalaman dan portofolio profesional"
      : "Build professional experience and portfolios",
    feature3: isId
      ? "Hubungkan pendidikan dengan dunia kerja"
      : "Connect education with the world of work",
    admin: isId ? "Login administrator" : "Administrator login",
    showPassword: isId
      ? "Tampilkan kata sandi"
      : "Show password",
    hidePassword: isId
      ? "Sembunyikan kata sandi"
      : "Hide password",
    language: isId ? "Pilih bahasa" : "Choose language",
  };

  const changeRole = (role: LoginRole) => {
    setActiveTab(role);
    setError("");
  };

  const handleLogin = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError(content.required);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError(content.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      /*
       * LOGIN DEMO
       *
       * Nama diambil dari bagian email sebelum @.
       * Contoh: budi.santoso@gmail.com menjadi Budi Santoso.
       *
       * Ini bukan autentikasi server. Untuk produksi,
       * ambil nama dan role dari data akun yang terverifikasi.
       */
      const emailPrefix = cleanEmail.split("@")[0];

      const displayName = emailPrefix
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (character) =>
          character.toUpperCase()
        );

      loginAs({
        id: `${activeTab}-${cleanEmail.toLowerCase()}`,
        name: displayName,
        email: cleanEmail,
        role: activeTab,
      });
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError(content.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* PANEL KIRI */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

          <button
            type="button"
            onClick={() => setCurrentView("landing")}
            className="relative z-10 flex w-fit items-center gap-3 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-lg">
              <BriefcaseBusiness size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                InternSpace
              </h1>
              <p className="text-xs text-blue-200">
                Internship &amp; Career Platform
              </p>
            </div>
          </button>

          <div className="relative z-10 my-12 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100 backdrop-blur-sm">
              <Sparkles size={16} />
              <span>Discover. Connect. Grow.</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              {content.heroTitle}
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/90 xl:text-lg">
              {content.heroDesc}
            </p>

            <div className="mt-9 space-y-5">
              {[
                content.feature1,
                content.feature2,
                content.feature3,
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm leading-6 text-blue-50">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-blue-200/80">
            © {new Date().getFullYear()} InternSpace. All rights reserved.
          </p>
        </section>

        {/* PANEL KANAN */}
        <section className="flex min-h-screen flex-col bg-white px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between lg:mb-0">
            <button
              type="button"
              onClick={() => setCurrentView("landing")}
              className="flex items-center gap-2.5 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
                <BriefcaseBusiness size={21} />
              </div>
              <span className="text-xl font-bold text-slate-900">
                InternSpace
              </span>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Globe
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <select
                  aria-label={content.language}
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value as "id" | "en"
                    )
                  }
                  className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition hover:border-blue-300 focus:border-blue-500"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              <button
                type="button"
                title={content.admin}
                aria-label={content.admin}
                onClick={() => setCurrentView("login_admin")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <ShieldCheck size={19} />
              </button>
            </div>
          </div>

          {/* FORM LOGIN */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                {activeTab === "student" ? (
                  <GraduationCap size={29} />
                ) : (
                  <BriefcaseBusiness size={27} />
                )}
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {content.welcome}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                {content.subtitle}
              </p>
            </div>

            {/* PILIH PERAN */}
            <div className="mb-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => changeRole("student")}
                className={`rounded-2xl border p-4 text-left transition ${
                  activeTab === "student"
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap
                    size={21}
                    className={
                      activeTab === "student"
                        ? "text-blue-700"
                        : "text-slate-500"
                    }
                  />
                  <span className="font-semibold text-slate-900">
                    {content.student}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {content.studentDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => changeRole("company")}
                className={`rounded-2xl border p-4 text-left transition ${
                  activeTab === "company"
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={20}
                    className={
                      activeTab === "company"
                        ? "text-blue-700"
                        : "text-slate-500"
                    }
                  />
                  <span className="font-semibold text-slate-900">
                    {content.company}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {content.companyDesc}
                </p>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {content.email}
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={content.emailPlaceholder}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    {content.password}
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentView("forgot_password")
                    }
                    className="text-xs font-semibold text-blue-700 transition hover:text-blue-900"
                  >
                    {content.forgot}
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={content.passwordPlaceholder}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? content.hidePassword
                        : content.showPassword
                    }
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {/* TOMBOL LOGIN */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                    {content.processing}
                  </span>
                ) : (
                  content.login
                )}
              </button>
            </form>

            {/* DAFTAR */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                {content.noAccount}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentView(
                      activeTab === "student"
                        ? "register_student"
                        : "register_company"
                    )
                  }
                  className="font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  {content.register}
                </button>
              </p>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-5">
              <p className="text-center text-xs leading-5 text-slate-400">
                {content.footer}
              </p>
            </div>
          </div>

          <p className="pb-2 text-center text-xs text-slate-400 lg:hidden">
            © {new Date().getFullYear()} InternSpace
          </p>
        </section>
      </div>
    </div>
  );
};

export { AuthPage };
export default AuthPage;
