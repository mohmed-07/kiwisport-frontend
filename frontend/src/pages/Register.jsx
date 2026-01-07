import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",         // Required for Manager view
    phone_number: "", // Required for Manager view
    sport_type: "Gym",// Required for Manager view
    date_of_birth: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. TODO: Call your Django API here (POST /api/register/)
    // This should create a User AND a Member entry in your database.
    
    console.log("Registering:", formData);
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center bg-blend-overlay">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Join the Club 🥝</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Account Info */}
            <div className="md:col-span-2">
                <input name="username" onChange={handleChange} placeholder="Choose Username" className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none" />
            </div>
            <div className="md:col-span-2">
                <input name="password" type="password" onChange={handleChange} placeholder="Choose Password" className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none" />
            </div>

            {/* Member Info (Visible to Manager) */}
            <div className="md:col-span-2 border-t border-gray-600 my-2"></div>

            <div className="md:col-span-2">
                <label className="text-gray-300 text-xs ml-1">Full Name</label>
                <input name="name" onChange={handleChange} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none" />
            </div>

            <div>
                 <label className="text-gray-300 text-xs ml-1">Phone</label>
                <input name="phone_number" onChange={handleChange} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none" />
            </div>

            <div>
                 <label className="text-gray-300 text-xs ml-1">Sport</label>
                <select name="sport_type" onChange={handleChange} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none">
                    <option value="Gym">Gym</option>
                    <option value="Karate">Karate</option>
                    <option value="Football">Football</option>
                </select>
            </div>

            <div className="md:col-span-2">
                 <label className="text-gray-300 text-xs ml-1">Date of Birth</label>
                <input name="date_of_birth" type="date" onChange={handleChange} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none" />
            </div>

            <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 transition-all">
                Create Account
            </button>
        </form>
         <p className="mt-6 text-center text-gray-400 text-sm">
            Already a member? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}