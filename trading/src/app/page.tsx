import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b101e] text-white flex flex-col font-sans relative overflow-hidden"
         style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-6 z-10 relative">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">PrimeInvest</span>
        </div>
        <Link href="/login" className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium">
          Login
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full relative">
        
        {/* AI-Powered Returns Badge */}
        <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121624] border border-white/10 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-blue-400">AI-Powered Returns</span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            Invest in the Future of <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI Computing</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Join thousands of investors earning daily returns from our GPU datacenter infrastructure powering next-gen AI models.
          </p>
        </div>

        {/* Feature List */}
        <div className="w-full max-w-[600px] space-y-4 mb-10">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#121624] border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Enterprise GPU Infrastructure</h3>
              <p className="text-sm text-gray-400">NVIDIA H100 & A100 datacenters</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#121624] border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Automated Daily Returns</h3>
              <p className="text-sm text-gray-400">Profits credited every 24 hours</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#121624] border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">5-Level Referral Program</h3>
              <p className="text-sm text-gray-400">Earn up to 15% from your network</p>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="w-full max-w-[600px] flex flex-col gap-4 mb-10">
          <Link href="/register" className="w-full bg-gradient-to-r from-[#3ba2ff] to-[#8d49f7] hover:from-[#328ddf] hover:to-[#763dcf] text-white font-semibold py-4 rounded-xl text-center transition-all duration-300 shadow-[0_0_15px_rgba(141,73,247,0.3)] flex justify-center items-center gap-2">
            Get Started Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link href="/login" className="w-full bg-[#0a0f18] hover:bg-[#121624] border border-white/10 text-white font-medium py-4 rounded-xl text-center transition-all duration-300">
            Already have an account? Login
          </Link>
        </div>

        {/* Footer Security Badge */}
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          256-bit SSL Encrypted • Secure Payments
        </div>

      </main>
    </div>
  );
}
