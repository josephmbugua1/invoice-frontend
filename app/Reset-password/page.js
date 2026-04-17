"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, oldPassword, newPassword } = form;

    if (!email.trim() || !oldPassword.trim() || !newPassword.trim()) {
      setError("All required fields must be completed.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from the old password.");
      return;
    }

    setError("");
    setSuccess(true);
    setSubmitted(true);

    try {
      await resetPassword({ email, oldPassword, newPassword });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setSuccess(false);
      setSubmitted(false);
      setError(
        err?.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
                Secure password reset
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Update your password securely.
              </h1>
              <p className="text-base leading-8 text-slate-400">
                Strengthen your account security by resetting your password. Verify your identity and create a new, strong password.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Enhanced security</p>
                  <p className="mt-3 text-lg font-semibold text-white">Verify with old password</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Strong protection</p>
                  <p className="mt-3 text-lg font-semibold text-white">Validated new password</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-md">
              <div className="mb-8 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Reset password
                </p>
                <h2 className="text-3xl font-semibold text-white">Create new credentials</h2>
                <p className="text-xs text-slate-500">All fields are required</p>
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
                  <span className="text-sm font-medium text-slate-300">Current password</span>
                  <input
                    name="oldPassword"
                    type="password"
                    value={form.oldPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter current password"
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
                    placeholder="Create new password"
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>

                {error ? (
                  <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                ) : null}

                {success ? (
                  <p className="rounded-3xl bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                    Password reset successful! Redirecting to login...
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {submitted ? "Resetting..." : "Reset password"}
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
