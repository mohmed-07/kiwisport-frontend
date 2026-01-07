import { useAuth } from "../context/AuthContext";

export default function MemberHome() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navbar for Member */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <h1 className="text-xl font-bold text-gray-800">🥝 My Portal</h1>
        <div className="flex items-center gap-4">
            <span className="font-bold text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-red-500 text-sm font-bold border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50">Logout</button>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-lg opacity-80">Membership Status</h2>
            <p className="text-4xl font-bold mt-2">Active</p>
            <div className="mt-4 bg-white/20 p-2 rounded-lg inline-block text-sm">
                Next Payment: 01 Feb 2026
            </div>
        </div>

        {/* History Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-gray-700 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
                <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance (Gym)</span>
                    <span className="text-green-600 font-bold">Present</span>
                </li>
                <li className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment (Jan)</span>
                    <span className="text-blue-600 font-bold">Paid 200 DH</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}