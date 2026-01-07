import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  
  // --- STATE FOR DROPDOWNS ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- REFS (To detect clicks outside) ---
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // --- CLOSE DROPDOWNS ON OUTSIDE CLICK ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HELPER: GET PAGE TITLE ---
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Overview";
      case "/members": return "Team Members";
      case "/attendance": return "Attendance Tracker";
      case "/payments": return "Payments & Revenue";
      default: return "Dashboard";
    }
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-20 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      
      {/* LEFT: Mobile Menu & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h2>
          <p className="text-xs text-gray-400 font-medium hidden sm:block">{today}</p>
        </div>
      </div>

      {/* RIGHT: Notifications & Profile */}
      <div className="flex items-center gap-4">
        
        {/* --- NOTIFICATION BELL --- */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
          >
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>

          {/* Notification Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in origin-top-right">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-700">Notifications</h3>
                <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {/* Dummy Item 1 */}
                <div className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">💰</div>
                   <div>
                      <p className="text-sm font-semibold text-gray-800">New Payment Received</p>
                      <p className="text-xs text-gray-500">Medpo paid 200 DH for Gym.</p>
                      <p className="text-[10px] text-gray-400 mt-1">2 mins ago</p>
                   </div>
                </div>
                {/* Dummy Item 2 */}
                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">👋</div>
                   <div>
                      <p className="text-sm font-semibold text-gray-800">New Member Joined</p>
                      <p className="text-xs text-gray-500">Welcome "Karim" to the team!</p>
                      <p className="text-[10px] text-gray-400 mt-1">1 hour ago</p>
                   </div>
                </div>
              </div>
              <div className="p-2 border-t text-center">
                  <button className="text-xs font-bold text-gray-500 hover:text-gray-800">View All</button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* --- USER PROFILE --- */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Medpo</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Admin</div>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 ring-2 ring-white transition-transform ${isProfileOpen ? "scale-105 ring-blue-100" : ""}`}>
              M
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in origin-top-right">
                <div className="p-4 border-b bg-gray-50">
                    <p className="text-sm font-bold text-gray-800">Signed in as</p>
                    <p className="text-xs text-gray-500 truncate">medpo@kiwisport.com</p>
                </div>
                <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2">
                        👤 My Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2">
                        ⚙️ Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-2">
                        💳 Billing
                    </button>
                </div>
                <div className="p-2 border-t">
                     <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 font-medium">
                        🚪 Sign Out
                    </button>
                </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}