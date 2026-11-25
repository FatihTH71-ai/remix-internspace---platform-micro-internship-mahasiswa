import React, { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, GraduationCap, LoaderCircle } from "lucide-react";
import { apiJson } from "../../lib/api";
import {
  useApp,
  type CompanyRegistrationInput,
  type RegistrationInput,
  type StudentRegistrationInput,
} from "../../context/AppContext";

type RegistrationRole = "student" | "company";

export const RegistrationPage: React.FC<{ role: RegistrationRole }> = ({ role }) => {
  const { registerAccount, setCurrentView } = useApp();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    major: "",
    nim: "",
    phone: "",
    companyName: "",
    industry: "",
    website: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setError("");
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const registration: RegistrationInput = role === "student"
      ? {
          role,
          name: values.name,
          email: values.email,
          password: values.password,
          university: values.university,
          major: values.major,
          nim: values.nim || undefined,
          phone: values.phone,
        } satisfies StudentRegistrationInput
      : {
          role,
          name: values.name,
          email: values.email,
          password: values.password,
          companyName: values.companyName,
          industry: values.industry,
          website: values.website || undefined,
        } satisfies CompanyRegistrationInput;

    try {
      await registerAccount(registration);
      setMessage("Account created. Check your email for the verification link before signing in.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = role === "student";
  const fields: Array<{ name: keyof typeof values; label: string; type?: string; required?: boolean }> = [
    { name: "name", label: "Your name", required: true },
    { name: "email", label: "Email address", type: "email", required: true },
    { name: "password", label: "Password (8+ characters)", type: "password", required: true },
    ...(isStudent
      ? [
          { name: "university" as const, label: "University", required: true },
          { name: "major" as const, label: "Major / study program", required: true },
          { name: "nim" as const, label: "Student number (optional)" },
          { name: "phone" as const, label: "Phone", required: true },
        ]
      : [
          { name: "companyName" as const, label: "Company name", required: true },
          { name: "industry" as const, label: "Industry", required: true },
          { name: "website" as const, label: "Website (optional)", type: "url" },
        ]),
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-10">
        <button type="button" onClick={() => setCurrentView("login")} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft size={16} /> Back to sign in
        </button>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          {isStudent ? <GraduationCap size={24} /> : <BriefcaseBusiness size={24} />}
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create a {isStudent ? "student" : "company"} account
        </h1>
        <p className="mt-2 text-sm text-slate-500">Verify your email before signing in.</p>

        {message ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
            <p>{message}</p>
            <button type="button" onClick={() => setCurrentView("login")} className="mt-3 font-semibold underline">
              Continue to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {fields.map((field) => (
              <label key={field.name} className="block text-sm font-medium text-slate-700">
                {field.label}
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  minLength={field.name === "password" ? 8 : undefined}
                  maxLength={field.name === "password" ? 72 : undefined}
                  value={values[field.name]}
                  onChange={update}
                  autoComplete={field.name === "password" ? "new-password" : field.name === "email" ? "email" : "off"}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            ))}
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">
              {loading && <LoaderCircle size={17} className="animate-spin" />}
              Create account
            </button>
          </form>
        )}
      </section>
    </main>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiJson<{ message: string; developmentResetUrl?: string }>(
        "/auth/forgot-password",
        "POST",
        { email },
      );
      setMessage(result.message);
      setDevelopmentResetUrl(result.developmentResetUrl ?? "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
      setMessage("");
      setDevelopmentResetUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionShell title="Reset your password" onBack={() => setCurrentView("login")}>
      <p className="text-sm text-slate-500">Enter your account email and we’ll send a reset link if it matches an active account.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <input type="email" required autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(""); setDevelopmentResetUrl(""); setError(""); }} placeholder="name@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
        {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        {developmentResetUrl && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p>SMTP is not configured. This development-only link is shown for local testing:</p>
            <a href={developmentResetUrl} className="mt-2 inline-block break-all font-semibold underline">Open password reset form</a>
          </div>
        )}
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Sending…" : "Send reset link"}</button>
      </form>
    </ActionShell>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiJson<{ message: string }>("/auth/reset-password", "POST", { token, password });
      setMessage(result.message);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionShell title="Choose a new password" onBack={() => setCurrentView("login")}>
      {!token ? (
        <p role="alert" className="text-sm text-red-700">This password reset link is incomplete.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
          </label>
          {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Updating…" : "Update password"}</button>
        </form>
      )}
    </ActionShell>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const { setCurrentView } = useApp();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token") ?? "";
  const isInvitation = searchParams.get("invited") === "1";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!token) {
      setError("This verification link is incomplete.");
      setLoading(false);
      return () => { active = false; };
    }
    void apiJson<{ message: string }>("/auth/verify-email", "POST", { token })
      .then((result) => { if (active) setMessage(result.message); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Email verification failed.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  return (
    <ActionShell title="Email verification" onBack={() => setCurrentView("login")}>
      <div className="flex items-start gap-3 text-sm">
        <CheckCircle2 className={`mt-0.5 shrink-0 ${error ? "text-red-600" : "text-emerald-600"}`} size={18} />
        <p role={error ? "alert" : "status"}>
          {loading
            ? "Verifying your email…"
            : error || (isInvitation
              ? "Your email is verified. Next, use Forgot password to create a password for your account."
              : message)}
        </p>
      </div>
      {!loading && !error && (
        <button
          type="button"
          onClick={() => setCurrentView(isInvitation ? "forgot_password" : "login")}
          className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white"
        >
          {isInvitation ? "Set password" : "Continue to sign in"}
        </button>
      )}
    </ActionShell>
  );
};

const ActionShell: React.FC<{
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ title, onBack, children }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-lg sm:p-9">
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <ArrowLeft size={16} /> Back to sign in
      </button>
      <h1 className="mb-5 text-2xl font-bold text-slate-900">{title}</h1>
      {children}
    </section>
  </main>
);
