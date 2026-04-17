"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyInvoices, createInvoice } from "@/lib/invoice";
import { logout } from "@/lib/auth";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    supplierName: "",
    buyerName: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");

    if (!token) {
      router.push("/login");
      return;
    }

    if (role === "ADMIN") {
      router.push("/admin");
      return;
    }

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = "Invoice number is required";
    }

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
    }

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = "Buyer name is required";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Creating invoice with token:", token ? "✓ Token exists" : "✗ No token");
      
      const payload = {
        invoiceNumber: formData.invoiceNumber.trim(),
        amount: parseFloat(formData.amount),
        supplierName: formData.supplierName.trim(),
        buyerName: formData.buyerName.trim(),
      };
      console.log("Invoice payload:", payload);
      
      await createInvoice(payload);

      // Reset form
      setFormData({ invoiceNumber: "", amount: "", supplierName: "", buyerName: "" });

      // Reload invoices
      await loadInvoices();
    } catch (err) {
      console.error("Error creating invoice:", err);
      console.error("Error status:", err?.response?.status);
      console.error("Error data:", err?.response?.data);
      setErrors({ submit: err?.response?.data?.message || "Failed to create invoice. Please check your token and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
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
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/invoices" className="transition hover:text-white">
              Invoices
            </Link>
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
              Create and manage your invoices
            </h1>
            <p className="text-lg leading-8 text-slate-300">
              Submit new invoices for approval and track the status of your existing ones.
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

          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {/* Create Invoice Form */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <h2 className="text-2xl font-semibold text-white mb-6">Create New Invoice</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-300 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="INV-1002"
                    disabled={submitting}
                  />
                  {errors.invoiceNumber && (
                    <p className="mt-1 text-sm text-rose-400">{errors.invoiceNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="supplierName" className="block text-sm font-medium text-slate-300 mb-2">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="ABC Ltd"
                    disabled={submitting}
                  />
                  {errors.supplierName && (
                    <p className="mt-1 text-sm text-rose-400">{errors.supplierName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="buyerName" className="block text-sm font-medium text-slate-300 mb-2">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    id="buyerName"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="XY Corp"
                    disabled={submitting}
                  />
                  {errors.buyerName && (
                    <p className="mt-1 text-sm text-rose-400">{errors.buyerName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="5000.00"
                    disabled={submitting}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-rose-400">{errors.amount}</p>
                  )}
                </div>


                {errors.submit && (
                  <p className="text-sm text-rose-400">{errors.submit}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating Invoice..." : "Create Invoice"}
                </button>
              </form>
            </div>

            {/* My Invoices List */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">My Invoices</h2>
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
                  <p className="text-slate-400 mb-6">You haven't created any invoices yet</p>
                  <p className="text-sm text-slate-500">Use the form on the left to create your first invoice</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}