import Link from 'next/link';

export default function Home() {
  const stats = [
    { label: 'Active nodes', value: '4,281' },
    { label: 'Total payout', value: '$1.2M+' },
    { label: 'Hash rate', value: '8.5 PH/s' },
  ];

  const features = [
    {
      title: 'GPU datacenters',
      sub: 'H100 & A100 clusters',
      icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    },
    {
      title: 'Daily ROI',
      sub: 'Automated settlements',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
    {
      title: 'Scale your network',
      sub: '5-level commission',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
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
          <span className="text-[15px] font-semibold tracking-tight">Prime<span className="gradient-text">invest</span>pro</span>
        </div>
        <Link href="/login" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Log in&nbsp;&rsaquo;
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero */}
        <section className="w-full max-w-3xl px-6 pt-20 sm:pt-28 pb-16 text-center">
          <div className="animate-rise inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full chip text-[12px] font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5b5bd6] animate-pulse-soft" />
            AI-powered GPU mining
          </div>
          <h1 className="animate-rise text-[44px] sm:text-[68px] leading-[1.04] font-semibold tracking-[-0.03em]" style={{ animationDelay: '.05s' }}>
            Monetize the<br />
            <span className="gradient-text">AI revolution.</span>
          </h1>
          <p className="animate-rise mx-auto max-w-xl mt-6 text-[17px] sm:text-[19px] leading-relaxed text-[#6e6e73]" style={{ animationDelay: '.1s' }}>
            Own a piece of the world&apos;s most powerful AI infrastructure. Earn automated daily returns from high-performance GPU datacenters.
          </p>
          <div className="animate-rise mt-9 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '.15s' }}>
            <Link href="/register" className="btn-primary px-7 py-3 rounded-full text-[15px] font-medium inline-flex items-center gap-2 group">
              Get started
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link href="/login" className="btn-ghost px-7 py-3 rounded-full text-[15px] font-medium">
              Sign in
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="w-full max-w-4xl px-6 pb-16">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="animate-rise glass glass-hover rounded-2xl px-4 py-6 sm:py-7 text-center" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                <p className="text-[24px] sm:text-[30px] font-semibold tracking-tight">{s.value}</p>
                <p className="mt-1 text-[12px] sm:text-[13px] text-[#86868b]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="w-full max-w-5xl px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="animate-rise glass glass-hover rounded-3xl p-7 sm:p-8" style={{ animationDelay: `${0.25 + i * 0.05}s` }}>
                <div className="w-11 h-11 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center mb-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={f.icon} /></svg>
                </div>
                <h3 className="text-[17px] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1 text-[14px] text-[#86868b]">{f.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="w-full max-w-5xl px-6 pb-20">
          <div className="glass rounded-[28px] px-8 py-12 sm:py-14 text-center relative overflow-hidden">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-[#5b5bd6]/15 blob" />
            <div className="relative">
              <h2 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em]">Ready to deploy your node?</h2>
              <p className="mx-auto max-w-md mt-3 text-[16px] text-[#6e6e73]">Set up takes under two minutes. No hardware required.</p>
              <Link href="/register" className="btn-primary mt-7 inline-flex items-center gap-2 px-7 py-3 rounded-full text-[15px] font-medium group">
                Initialize your node
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
              { t: 'Encrypted', d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
              { t: 'PCI DSS', d: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z' },
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
