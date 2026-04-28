
export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-[#121624] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400 text-sm">Manage your profile and settings here.</p>
        <div className="mt-8 border border-white/5 rounded-xl bg-[#0b101e] p-6 h-64 flex items-center justify-center text-gray-500">
          Profile Data Will Appear Here
        </div>
      </div>
    </div>
  );
}