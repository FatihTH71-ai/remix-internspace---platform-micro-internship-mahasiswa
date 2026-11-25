import React, { useEffect, useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, Clock3, Smartphone, Upload } from "lucide-react";
import { useApp, type PaymentMethod } from "../../context/AppContext";
import { apiRequest } from "../../lib/api";

interface PaymentCheckoutPageProps {
  isSuccessView?: boolean;
}

export const PaymentCheckoutPage: React.FC<PaymentCheckoutPageProps> = ({ isSuccessView = false }) => {
  const {
    currentUser,
    pendingPaymentPlan,
    latestTransaction,
    createTransaction,
    setCurrentView,
  } = useApp();
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [proof, setProof] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<"pending" | "verified" | "rejected" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const transactionStatus = latestTransaction?.id === transactionId
    ? latestTransaction.status
    : serverStatus;

  useEffect(() => {
    if (pendingPaymentPlan) return;
    let active = true;
    void apiRequest<{ transactions: Array<{ id: string; amount: number; status: "pending" | "verified" | "rejected" }> }>("/transactions/mine")
      .then(({ transactions }) => {
        const latest = transactions[0];
        if (!active || !latest) return;
        setTransactionId(latest.id);
        setAmount(latest.amount);
        setServerStatus(latest.status);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load payment status.");
      });
    return () => { active = false; };
  }, [pendingPaymentPlan]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!pendingPaymentPlan) {
      setError("Select a premium plan before starting checkout.");
      return;
    }
    if (!proof) {
      setError("Choose your payment proof file.");
      return;
    }
    if (proof.size > 5 * 1024 * 1024) {
      setError("The payment proof must be 5 MB or smaller.");
      return;
    }

    setLoading(true);
    try {
      const transaction = await createTransaction(pendingPaymentPlan.id, method, proof);
      setTransactionId(transaction.id);
      setAmount(transaction.amount);
      setServerStatus(transaction.status);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The payment request could not be submitted.");
    } finally {
      setLoading(false);
    }
  };

  const formattedAmount = amount === null
    ? null
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);

  if (transactionId && formattedAmount) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <section className="w-full max-w-lg space-y-5 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            {transactionStatus === "verified" ? <CheckCircle2 size={30} /> : <Clock3 size={30} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {transactionStatus === "verified" ? "Payment verified" : transactionStatus === "rejected" ? "Payment proof rejected" : "Payment submitted"}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              {transactionStatus === "verified" ? "Premium is active" : transactionStatus === "rejected" ? "Submit a new payment proof" : "Awaiting admin verification"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {transactionStatus === "verified"
                ? "Your premium subscription has been activated."
                : transactionStatus === "rejected"
                  ? "An administrator rejected this proof. Review the instructions and submit a new proof."
                  : "Your payment proof was received. Premium access starts only after an administrator verifies it."}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 text-left text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-200 pb-3">
              <span className="text-slate-500">Transaction</span>
              <span className="break-all font-mono text-xs font-semibold text-slate-800">{transactionId}</span>
            </div>
            <div className="flex justify-between gap-4 pt-3">
              <span className="text-slate-500">Server-confirmed amount</span>
              <span className="font-bold text-slate-900">{formattedAmount}</span>
            </div>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            No payment gateway or bank account is configured here. Use payment instructions provided by InternSpace; do not send funds to details from this demo interface.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView(currentUser?.role === "company" ? "company_dashboard" : "student_dashboard")}
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Return to dashboard
          </button>
        </section>
      </main>
    );
  }

  if (!pendingPaymentPlan) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center">
          <h1 className="text-xl font-bold text-slate-900">No plan selected</h1>
          <p className="mt-2 text-sm text-slate-600">Choose a premium plan before submitting a payment proof.</p>
          <button type="button" onClick={() => setCurrentView("premium")} className="mt-5 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white">
            View plans
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-3xl space-y-6">
        <button type="button" onClick={() => setCurrentView("premium")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft size={16} /> Back to plans
        </button>

        <header>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Manual payment review</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Submit payment proof</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your plan and price are validated by the server. Premium remains inactive until an administrator verifies the proof.
          </p>
        </header>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
            <fieldset>
              <legend className="text-sm font-bold text-slate-900">Payment method</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <PaymentMethodButton
                  selected={method === "bank_transfer"}
                  onClick={() => setMethod("bank_transfer")}
                  icon={<Building2 size={19} />}
                  title="Bank transfer"
                />
                <PaymentMethodButton
                  selected={method === "ewallet"}
                  onClick={() => setMethod("ewallet")}
                  icon={<Smartphone size={19} />}
                  title="E-wallet"
                />
              </div>
            </fieldset>

            <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-5 text-amber-900">
              Payment processing is not integrated. Make a transfer only using verified instructions supplied by InternSpace, then upload the receipt below. This form does not generate a virtual-account number or QR code.
            </p>

            <label className="block text-sm font-bold text-slate-900">
              Payment proof
              <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-4 font-normal hover:border-blue-500">
                <Upload className="shrink-0 text-blue-700" size={20} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{proof?.name ?? "Choose a receipt or transfer proof"}</span>
                  <span className="block text-xs text-slate-500">JPG, PNG or PDF, up to 5 MB</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="sr-only"
                  onChange={(event) => {
                    setProof(event.target.files?.[0] ?? null);
                    setError("");
                  }}
                  required
                />
              </span>
            </label>

            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white disabled:opacity-60">
              {loading ? "Submitting…" : "Submit for verification"}
            </button>
          </div>

          <aside className="h-fit space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-slate-900">Selected plan</h2>
            <p className="text-sm text-slate-600">{pendingPaymentPlan.name}</p>
            <p className="text-xs leading-5 text-slate-500">
              The final amount is returned from the server when the transaction is created.
            </p>
          </aside>
        </form>

        {isSuccessView && !transactionId && (
          <p className="text-center text-sm text-slate-500">No verified payment is associated with this session.</p>
        )}
      </section>
    </main>
  );
};

const PaymentMethodButton: React.FC<{
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}> = ({ selected, onClick, icon, title }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition ${
      selected ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-700 hover:border-slate-300"
    }`}
  >
    {icon}
    {title}
  </button>
);
