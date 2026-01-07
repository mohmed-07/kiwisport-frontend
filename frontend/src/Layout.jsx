import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar"; // Import the new component

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* 1. SIDEBAR (Responsive Logic) */}
      {/* On desktop (lg), it is always visible (block). On mobile, it hides unless isSidebarOpen is true */}
      <div className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
         <Sidebar />
      </div>

      {/* Overlay for mobile (closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* The Top Bar */}
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* The Page Content (Scrollable) */}
        <main className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <Outlet />
        </main>
        
      </div>

    </div>
  );
}