import Link from 'next/link';

export default function Home() {
  const stats = [
    { label: 'Assets under management', value: '$2.4M' },
    { label: 'Active investors', value: '32,000+' },
    { label: 'Avg. monthly yield', value: '4.6%' },
    { label: 'Payouts processed', value: '$86K' },
  ];

  const ticker = [
    { sym: 'H100', name: 'GPU cluster', yield: '+0.18%', up: true },
    { sym: 'A100', name: 'AI compute', yield: '+0.14%', up: true },
    { sym: 'L40S', name: 'Inference', yield: '+0.11%', up: true },
    { sym: 'BTC·HASH', name: 'Hash index', yield: '+0.06%', up: true },
    { sym: 'ETH·STAKE', name: 'Validator', yield: '-0.02%', up: false },
  ];

  const steps = [
    {
      n: '01',
      title: 'Fund your account',
      body: 'Deposit in seconds with crypto or bank transfer. No minimums, no setup fees.',
    },
    {
      n: '02',
      title: 'Allocate to a strategy',
      body: 'Choose a managed plan tuned for your horizon — from conservative to high-yield AI compute.',
    },
    {
      n: '03',
      title: 'Earn on autopilot',
      body: 'Returns settle daily into your wallet. Withdraw anytime, compound, or reinvest with one tap.',
    },
  ];

  const features = [
    {
      title: 'GPU datacenters',
      sub: 'H100 & A100 clusters across 4 regions, running at 98% utilization.',
      icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    },
    {
      title: 'Daily settlements',
      sub: 'Yield streams into your wallet every 24h. No lockups on the Starter tier.',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
    {
      title: 'Multi-level rewards',
      sub: 'Grow with us — earn a 5-level referral commission on every active node.',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  ];

  const testimonials = [
    {
      quote:
        '"Daily yields hit my wallet before my morning coffee. The dashboard is the cleanest I have used in fintech."',
      name: 'Amelia R.',
      role: 'Pro investor · 14 months',
    },
    {
      quote:
        '"We moved a portion of our treasury into the Institutional tier. Reporting and custody are first-class."',
      name: 'Marcus L.',
      role: 'Family office',
    },
    {
      quote:
        '"Started at $200 and compounded. The referral network alone pays for my subscription five times over."',
      name: 'Priya S.',
      role: 'Starter → Pro',
    },
  ];

  const faqs = [
    {
      q: 'How are returns generated?',
      a: 'Capital is allocated to enterprise-grade GPU and ASIC infrastructure leased to AI and crypto compute markets. Revenue from compute contracts is distributed to investors daily, net of operating costs.',
    },
    {
      q: 'Is my capital protected?',
      a: 'Funds are custodied in segregated, audited wallets. We publish proof-of-reserves monthly and maintain a 12% operational buffer to absorb short-term compute price volatility.',
    },
    {
      q: 'How fast can I withdraw?',
      a: 'Starter tier withdrawals settle in under 30 minutes. Pro and Institutional cycles unlock at the end of their term, with early-exit available subject to a small spread.',
    },
    {
      q: 'Do I need to manage anything?',
      a: 'Nothing. Allocation, rebalancing and payout scheduling are fully automated. You only choose the plan — we run the infrastructure.',
    },
  ];

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-5 sm:px-8 h-16 sticky top-0 z-30 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e6e6eb]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5b5bd6] flex items-center justify-center">
            <img src="/logo.png" alt="primeinvestpro" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Prime<span className="gradient-text">invest</span>pro
          </span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-[13px] text-[#515159]">
          <a href="#how" className="hover:text-[#1d1d1f] transition-colors">How it works</a>
          <a href="#faq" className="hover:text-[#1d1d1f] transition-colors">FAQ</a>
        </div>
        <Link href="/login" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Log in&nbsp;&rsaquo;
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero */}
        <section className="w-full max-w-3xl px-6 pt-20 sm:pt-28 pb-14 text-center">
          <div className="animate-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full chip text-[12px] font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5b5bd6] animate-pulse-soft" />
            AI infrastructure investing · made simple
          </div>
          <h1 className="animate-rise text-[44px] sm:text-[68px] leading-[1.04] font-semibold tracking-[-0.03em]" style={{ animationDelay: '.05s' }}>
            Invest in the compute<br />
            <span className="gradient-text">that powers tomorrow.</span>
          </h1>
          <p className="animate-rise mx-auto max-w-xl mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[#6e6e73]" style={{ animationDelay: '.1s' }}>
            Own a fractional stake in the world&apos;s most in-demand GPU clusters. Earn automated daily yield from real revenue — no hardware, no spreadsheets, no surprises.
          </p>
          <div className="animate-rise mt-9 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '.15s' }}>
            <Link href="/register" className="btn-primary px-7 py-3 rounded-full text-[15px] font-medium inline-flex items-center gap-2 group">
              Start investing
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link href="/login" className="btn-ghost px-7 py-3 rounded-full text-[15px] font-medium">
              Sign in
            </Link>
          </div>
          <p className="animate-rise mt-6 text-[12px] text-[#aeaeb5]" style={{ animationDelay: '.2s' }}>
            No minimum balance · Withdraw anytime · Audited monthly
          </p>
        </section>

        {/* Live yield strip */}
        <section className="w-full max-w-5xl px-6 pb-14">
          <div className="animate-rise glass rounded-2xl px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-6 overflow-x-auto" style={{ animationDelay: '.22s' }}>
            <div className="flex items-center gap-2 shrink-0 pr-3 sm:pr-5 border-r border-[#e6e6eb]">
              <span className="w-2 h-2 rounded-full bg-[#15a86b] animate-pulse-soft" />
              <span className="text-[11px] sm:text-[12px] font-medium tracking-wide text-[#515159] uppercase">Live yield</span>
            </div>
            {ticker.map((t) => (
              <div key={t.sym} className="flex items-center gap-2.5 shrink-0">
                <div className="leading-tight">
                  <p className="text-[12px] sm:text-[13px] font-semibold tracking-tight">{t.sym}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#86868b]">{t.name}</p>
                </div>
                <span className={`text-[12px] sm:text-[13px] font-medium tabular-nums ${t.up ? 'text-[#15a86b]' : 'text-[#d04545]'}`}>
                  {t.yield}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="w-full max-w-5xl px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="animate-rise glass glass-hover rounded-2xl px-4 py-6 sm:py-7 text-center" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
                <p className="text-[24px] sm:text-[30px] font-semibold tracking-tight">{s.value}</p>
                <p className="mt-1 text-[12px] sm:text-[13px] text-[#86868b]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="w-full max-w-5xl px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-[12px] tracking-[0.18em] uppercase text-[#5b5bd6] font-medium mb-3">How it works</p>
            <h2 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.025em]">Three steps to your first yield.</h2>
            <p className="mt-3 text-[15px] sm:text-[16px] text-[#6e6e73] max-w-lg mx-auto">From sign-up to your first payout in under five minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="animate-rise glass glass-hover rounded-3xl p-7 sm:p-8 relative" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                <span className="text-[12px] font-mono text-[#aeaeb5] tracking-wider">{s.n}</span>
                <h3 className="mt-4 text-[19px] font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="w-full max-w-5xl px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-[12px] tracking-[0.18em] uppercase text-[#5b5bd6] font-medium mb-3">Why Primeinvestpro</p>
            <h2 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.025em]">Built like a fund. Feels like an app.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="animate-rise glass glass-hover rounded-3xl p-7 sm:p-8" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                <div className="w-11 h-11 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={f.icon} /></svg>
                </div>
                <h3 className="text-[17px] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#86868b]">{f.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full max-w-5xl px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-[12px] tracking-[0.18em] uppercase text-[#5b5bd6] font-medium mb-3">Investor stories</p>
            <h2 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.025em]">Trusted by a growing community.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <figure key={t.name} className="animate-rise glass glass-hover rounded-3xl p-7 sm:p-8 flex flex-col" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                <svg className="w-7 h-7 text-[#5b5bd6]/30 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden>
                  <path d="M9.4 8C5.3 8 2 11.3 2 15.4c0 3.5 2.4 6.2 5.7 6.8-.4 2-1.5 3.5-3.5 4.3l.6 1.5c4.7-1.1 8-5 8-10.2V8H9.4zm18 0c-4.1 0-7.4 3.3-7.4 7.4 0 3.5 2.4 6.2 5.7 6.8-.4 2-1.5 3.5-3.5 4.3l.6 1.5c4.7-1.1 8-5 8-10.2V8h-3.4z" />
                </svg>
                <blockquote className="text-[14.5px] leading-relaxed text-[#1d1d1f] flex-1">{t.quote}</blockquote>
                <figcaption className="mt-5 pt-5 border-t border-[#e6e6eb]">
                  <p className="text-[13px] font-semibold tracking-tight">{t.name}</p>
                  <p className="text-[12px] text-[#86868b]">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full max-w-3xl px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-[12px] tracking-[0.18em] uppercase text-[#5b5bd6] font-medium mb-3">FAQ</p>
            <h2 className="text-[32px] sm:text-[42px] font-semibold tracking-[-0.025em]">Common questions.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="animate-rise glass rounded-2xl p-6 sm:p-7" style={{ animationDelay: `${0.3 + i * 0.04}s` }}>
                <h3 className="text-[15.5px] font-semibold tracking-tight">{f.q}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="w-full max-w-5xl px-6 pb-20">
          <div className="glass rounded-[28px] px-8 py-12 sm:py-14 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-[#5b5bd6]/15 blob" />
            <div className="relative">
              <h2 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]">Your first yield is two minutes away.</h2>
              <p className="mx-auto max-w-md mt-3 text-[16px] text-[#6e6e73]">Join a growing community earning real yield from AI infrastructure.</p>
              <Link href="/register" className="btn-primary mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-medium group">
                Open my account
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="w-full border-t border-[#e6e6eb]">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[#aeaeb5]">
            {[
              { t: 'SSL secure', d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
              { t: 'Encrypted custody', d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
              { t: 'PCI DSS', d: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z' },
              { t: 'Proof of reserves', d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
            ].map((b) => (
              <div key={b.t} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={b.d} /></svg>
                <span className="text-[12px] font-medium">{b.t}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
