"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyInvoices } from "@/lib/invoice";
import { logout } from "@/lib/auth";

export default function UserDashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      router.push("/login");
      return;
    }

    setUserRole(role);
    if (storedUsername) {
      setUsername(storedUsername);
    }
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await getMyInvoices();
      setInvoices(res.data);
    } catch (err) {
      console.error("Error loading invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]";

    switch (status) {
      case "APPROVED":
        return `${baseClasses} bg-emerald-500/15 text-emerald-300`;
      case "REJECTED":
        return `${baseClasses} bg-rose-500/15 text-rose-300`;
      case "PENDING":
        return `${baseClasses} bg-amber-500/15 text-amber-300`;
      default:
        return `${baseClasses} bg-slate-500/15 text-slate-300`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return "✓";
      case "REJECTED":
        return "✗";
      case "PENDING":
        return "⏳";
      default:
        return "?";
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const stats = {
    total: invoices.length,
    pending: invoices.filter(inv => inv.status === "PENDING").length,
    approved: invoices.filter(inv => inv.status === "APPROVED").length,
    rejected: invoices.filter(inv => inv.status === "REJECTED").length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            InvoiceFlow
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link href="/invoices" className="transition hover:text-white">
              Invoices
            </Link>
            {userRole === "ADMIN" && (
              <Link href="/admin" className="transition hover:text-white">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="transition hover:text-white text-slate-300"
            >
              Logout
            </button>
          </nav>
        </header>

        <main className="flex-1 space-y-8 py-8">
          <div className="space-y-4">
            <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
              Welcome {username}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your invoice dashboard
            </h1>
            <p className="text-lg leading-8 text-slate-300">
              Manage your invoices, track payments, and create new ones with ease.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total invoices</p>
              <p className="mt-3 text-3xl font-semibold text-white">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-amber-400">Pending</p>
              <p className="mt-3 text-3xl font-semibold text-amber-300">{stats.pending}</p>
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">Approved</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-300">{stats.approved}</p>
            </div>
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-rose-400">Rejected</p>
              <p className="mt-3 text-3xl font-semibold text-rose-300">{stats.rejected}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">Your Invoices</h2>
                <button
                  onClick={loadInvoices}
                  disabled={loading}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-sky-500"></div>
                    <p className="mt-4 text-slate-400">Loading your invoices...</p>
                  </div>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-6">You haven&apos;t created any invoices yet</p>
                  <Link
                    href="/invoices"
                    className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    Create your first invoice
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 transition hover:border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">
                              Invoice #{inv.invoiceNumber}
                            </h3>
                            <span className={getStatusBadge(inv.status)}>
                              {getStatusIcon(inv.status)} {inv.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            Amount: <span className="font-medium text-slate-300">${inv.amount}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/invoices"
                    className="block w-full rounded-full bg-sky-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    Create New Invoice
                  </Link>
                  <Link
                    href="/invoices"
                    className="block w-full rounded-full border border-slate-600 px-6 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:text-white"
                  >
                    View All Invoices
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
                <h3 className="text-lg font-semibold text-white mb-4">Invoice Status Guide</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-300">
                      ⏳ PENDING
                    </span>
                    <span className="text-slate-400">Awaiting admin review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">
                      ✓ APPROVED
                    </span>
                    <span className="text-slate-400">Ready to send</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-rose-500/15 px-2 py-1 text-xs font-semibold text-rose-300">
                      ✗ REJECTED
                    </span>
                    <span className="text-slate-400">Needs revision</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
