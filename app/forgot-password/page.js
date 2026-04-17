"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");

    try {
      await forgotPassword({ email });
      setMessage("If this email exists, you’ll receive reset instructions shortly.");
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send reset email. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-10">
        <div className="space-y-6">
          <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
            Reset your password
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Recover access to your account.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-400">
            Enter the email address associated with your account and we’ll send you a secure password reset link.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
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

          <button className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Send reset link
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/login" className="text-sm text-slate-400 transition hover:text-white">
            Return to login
          </Link>
          <Link href="/Register" className="text-sm font-semibold text-slate-100 transition hover:text-white">
            Need a new account?
          </Link>
        </div>
      </div>
    </div>
  );
}
