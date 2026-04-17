"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdmin } from "@/lib/auth";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "ADMIN" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, role } = form;

    if (!email.trim() || !password.trim() || !role.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setError("");
    setSubmitted(true);

    try {
      await createAdmin({ email, password, role });
      router.push("/login");
    } catch (err) {
      setSubmitted(false);
      setError(
        err?.response?.data?.message ||
          "Admin registration failed. Please check your details and try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/30 backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
                Admin access
              </span>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Register an administrator account.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
                Create a secure admin account with role assignment for system control and invoice management.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Admin role</p>
                  <p className="mt-3 text-lg font-semibold text-white">System controller</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Secure entry</p>
                  <p className="mt-3 text-lg font-semibold text-white">Reserved for trusted users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-16">
            <div className="max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Admin registration
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Create admin account</h2>
                </div>
                <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
                  Required fields
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
                    placeholder="admin@example.com"
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
                    placeholder="Create a strong password"
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-300">Role</span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </label>

                {error ? (
                  <p className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  {submitted ? "Admin created! Redirecting..." : "Create admin account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-slate-100 transition hover:text-white">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
