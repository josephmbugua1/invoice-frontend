"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/lib/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, otp, newPassword } = form;

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await verifyOtp({ email, otp, newPassword });
      setMessage("OTP verified and password updated successfully. Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (err) {
      setSubmitting(false);
      setError(
        err?.response?.data?.message ||
          "Unable to verify OTP. Please check your details and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
                Verify OTP
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Confirm your code and reset your password.
              </h1>
              <p className="text-base leading-8 text-slate-400">
                Enter the email and OTP sent to your inbox, then choose a strong new password to regain access to your account.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Fast recovery</p>
                  <p className="mt-3 text-lg font-semibold text-white">Complete in one step</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Secure verification</p>
                  <p className="mt-3 text-lg font-semibold text-white">One-time code</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-md">
              <div className="mb-8 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  OTP verification
                </p>
                <h2 className="text-3xl font-semibold text-white">Enter your details</h2>
                <p className="text-xs text-slate-500">Required fields: email, otp, new password</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-medium text-slate-300">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">OTP code</span>
                  <input
                    name="otp"
                    type="text"
                    value={form.otp}
                    onChange={handleChange}
                    required
                    placeholder="Enter one-time code"
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">New password</span>
                  <input
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Create a new password"
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>

                {error ? (
                  <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                ) : null}

                {message ? (
                  <p className="rounded-3xl bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                    {message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {submitting ? "Verifying..." : "Verify OTP & Reset"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <Link href="/login" className="font-semibold text-slate-100 transition hover:text-white">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
