import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between py-6">
          <a className="text-lg font-semibold tracking-tight text-white" href="/">
            InvoiceFlow
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link className="transition hover:text-white" href="/login">
              Login
            </Link>
            <Link className="transition hover:text-white" href="/Register">
              Register
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-16 py-10 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <section className="space-y-8">
              <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-300">
                Built for reliable billing
              </div>
              <div className="max-w-2xl space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Professional invoicing that keeps your business moving.
                </h1>
                <p className="text-lg leading-8 text-slate-300">
                  Send polished invoices, track payments instantly, and manage your clients with a fast, modern workflow designed for freelancers, agencies, and growing teams.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-slate-950/10 transition hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/Register"
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:text-white"
                  >
                    Register as User
                  </Link>
                  <Link
                    href="/register-admin"
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-400 hover:text-white"
                  >
                    Register as Admin
                  </Link>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Save time</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Automated invoices</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Stay aligned</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Payment status at a glance</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Grow confidently</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Secure client management</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">InvoiceFlow overview</p>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-slate-950/90 p-6">
                    <p className="text-sm text-slate-400">Instant invoice builder</p>
                    <p className="mt-3 text-xl font-semibold text-white">
                      Create and send professional invoices in seconds.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/90 p-6">
                    <p className="text-sm text-slate-400">Client insights</p>
                    <p className="mt-3 text-xl font-semibold text-white">
                      Track overdue payments and revenue in one place.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/90 p-6">
                    <p className="text-sm text-slate-400">Secure access</p>
                    <p className="mt-3 text-xl font-semibold text-white">
                      Keep team accounts and admin actions organized safely.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Trusted by teams</p>
              <p className="text-3xl font-semibold text-white">Manage billing with confidence.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm text-slate-400">Invoices</p>
              <p className="mt-3 text-xl font-semibold text-white">Organize recurring and one-time payments effortlessly.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm text-slate-400">Analytics</p>
              <p className="mt-3 text-xl font-semibold text-white">See cash flow, outstanding balances, and active clients.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
