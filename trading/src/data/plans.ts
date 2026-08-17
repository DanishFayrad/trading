// Single source of truth for investment packages, shared by /plans and the dashboard.

// 1 USD ≈ Rs 278 (same rate used across the app).
export const PKR_PER_USD = 278;

// Daily return rate by tier: packages up to Rs 750 earn 10%/day, the rest earn 7%/day.
export const LOW_TIER_ROI = 0.10;   // price <= Rs 750
export const HIGH_TIER_ROI = 0.07;  // price >  Rs 750
export const dailyRoiFor = (price: number) => (price <= 750 ? LOW_TIER_ROI : HIGH_TIER_ROI);

export interface Plan {
  name: string;
  price: number;      // PKR
  duration: number;   // days
  hash: string;
  color: string;
  shadow: string;
}

// Prices are in PKR. Each package pays its daily ROI of the price per day for `duration` days.
export const plans: Plan[] = [
    { name: "Bronze Node",   price: 750,    duration: 30, hash: "1,200 GH/s",   color: "from-orange-400 to-orange-600",   shadow: "shadow-orange-200" },
    { name: "Silver Node",   price: 1500,   duration: 30, hash: "2,500 GH/s",   color: "from-slate-400 to-slate-600",     shadow: "shadow-slate-200" },
    { name: "Gold Node",     price: 3000,   duration: 30, hash: "5,000 GH/s",   color: "from-yellow-400 to-yellow-600",   shadow: "shadow-yellow-200" },
    { name: "Platinum Node", price: 6000,   duration: 30, hash: "10,000 GH/s",  color: "from-zinc-400 to-zinc-600",       shadow: "shadow-zinc-200" },
    { name: "Diamond Node",  price: 12000,  duration: 30, hash: "20,000 GH/s",  color: "from-cyan-400 to-cyan-600",       shadow: "shadow-cyan-200" },
    { name: "Titan Node",    price: 25000,  duration: 30, hash: "42,000 GH/s",  color: "from-blue-600 to-indigo-700",     shadow: "shadow-blue-200" },
    { name: "Quantum Node",  price: 50000,  duration: 30, hash: "85,000 GH/s",  color: "from-violet-500 to-purple-700",   shadow: "shadow-violet-200" },
    { name: "Apex Node",     price: 100000, duration: 30, hash: "170,000 GH/s", color: "from-fuchsia-500 to-pink-700",    shadow: "shadow-fuchsia-200" },
];

// Computed returns for a package.
export function planReturns(plan: Plan) {
  const rate = dailyRoiFor(plan.price);
  return {
    rate,
    dailyPkr: Math.round(plan.price * rate),                  // daily profit in PKR
    totalPkr: Math.round(plan.price * rate * plan.duration),  // total profit in PKR over the cycle
    dailyUsd: (plan.price * rate) / PKR_PER_USD,              // daily profit in USD
    totalUsd: Math.round(plan.price * rate * plan.duration) / PKR_PER_USD, // total profit in USD
    dailyRoi: (rate * 100).toFixed(0),                        // "10" or "7"
  };
}
