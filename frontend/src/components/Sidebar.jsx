import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // Helper to highlight the active link
  const getLinkClass = (path) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" // Active (Blue)
        : "text-gray-400 hover:bg-gray-800 hover:text-white"     // Inactive (Gray)
    }`;

  return (
    // 'h-screen' and 'sticky top-0' ensure it stays fixed while you scroll
    <div className="w-64 bg-slate-900 text-white h-screen p-5 flex flex-col border-r border-gray-800 sticky top-0">
      
      {/* 1. LOGO */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center text-lg shadow-lg shadow-green-900/20">
            🥝
         </div>
         <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Kiwisport
         </h2>
      </div>

      {/* 2. MENU LINKS */}
      <nav className="flex flex-col gap-2 flex-grow">
        <Link to="/" className={getLinkClass("/")}>
           <span>📊</span> Dashboard
        </Link>
        
        <Link to="/members" className={getLinkClass("/members")}>
           <span>👥</span> Members
        </Link>

        <Link to="/attendance" className={getLinkClass("/attendance")}>
           <span>📅</span> Attendance
        </Link>

        <Link to="/payments" className={getLinkClass("/payments")}>
           <span>💰</span> Payments
        </Link>
      </nav>

      {/* 3. DEVELOPER PROFILE (Fixed at Bottom) */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">
            Developed By
        </p>
        
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-default">
            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                ME
            </div>
            
            {/* Name & Title */}
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-200">
                    MOHAMED
                </span>
                <span className="text-[10px] text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded-md w-fit mt-0.5">
                    Full Stack Dev
                </span>
            </div>
        </div>
      </div>

    </div>
  );
}