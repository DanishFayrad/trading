
export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1a233a] to-[#121624] border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Account Balance</p>
          <h4 className="text-3xl font-bold font-mono text-white">$0.00</h4>
        </div>
        <div className="bg-gradient-to-br from-[#1a233a] to-[#121624] border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Active Investments</p>
          <h4 className="text-3xl font-bold font-mono text-white">$0.00</h4>
        </div>
        <div className="bg-gradient-to-br from-[#1a233a] to-[#121624] border border-white/10 rounded-2xl p-6 shadow-lg">
          <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Earnings</p>
          <h4 className="text-3xl font-bold font-mono text-white">$0.00</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            No transactions found
          </div>
        </div>
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Active GPU Plans</h3>
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
            No active plans
          </div>
        </div>
      </div>
    </div>
  );
}