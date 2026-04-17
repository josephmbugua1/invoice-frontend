"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = form;

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setSubmitted(true);

    try {
      const response = await loginUser({ email, password });
      const token = response?.data?.token;
      const role = response?.data?.role;
      const normalizedEmail = email.trim().toLowerCase();
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
      const registeredUsername = registeredUsers[normalizedEmail];

      const rawUsername =
        response?.data?.name ||
        response?.data?.username ||
        registeredUsername ||
        response?.data?.email ||
        email;
      const username = rawUsername.includes("@")
        ? rawUsername.split("@")[0]
        : rawUsername;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (role) {
        localStorage.setItem("role", role);
      }
      if (username) {
        localStorage.setItem("username", username);
      }

      // Redirect based on role
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setSubmitted(false);
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-5xl gap-10 rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-10 lg:grid-cols-[0.95fr_0.85fr]">
        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-900 p-8 sm:p-10">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Secure access
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sign in to manage your invoices with confidence.
            </h1>
            <p className="text-base leading-8 text-slate-400">
              Access your account, review payment status, and keep your billing workflow in sync with a secure login experience.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Trusted login</p>
                <p className="mt-3 text-lg font-semibold text-white">Fast and reliable</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Data protection</p>
                <p className="mt-3 text-lg font-semibold text-white">Built for privacy</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Login</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Welcome back</h2>
              </div>
              <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                Secure sign in
              </div>
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
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>

              <div className="flex items-center justify-between text-sm text-slate-400">
                <Link href="/forgot-password" className="hover:text-white">
                  Forgot password?
                </Link>
                <Link href="/Reset-password" className="font-semibold text-sky-300 hover:text-sky-200">
                  Reset password
                </Link>
              </div>

              {error ? (
                <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                {submitted ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don’t have an account?{' '}
              <Link href="/Register" className="font-semibold text-slate-100 transition hover:text-white">
                Register here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
