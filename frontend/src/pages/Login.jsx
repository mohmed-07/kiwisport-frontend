import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // --- TEMPORARY MOCK LOGIC (Connect to Django API later) ---
    if (username === "admin" && password === "admin") {
      login({ name: "Medpo", role: "admin", token: "fake-admin-token" });
    } else {
      // Assume it's a member login
      login({ name: username, role: "member", token: "fake-member-token" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
            <div className="text-4xl mb-2">🥝</div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-300 text-sm">Sign in to Kiwisport</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="text-gray-300 text-xs uppercase font-bold">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-green-400 outline-none transition-all"
                    placeholder="Enter username"
                />
            </div>
            <div>
                <label className="text-gray-300 text-xs uppercase font-bold">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-green-400 outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/30">
                Sign In
            </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
            New member? <Link to="/register" className="text-green-400 hover:text-green-300 font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
}