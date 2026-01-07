import React, { useEffect, useState } from "react";
import { 
  PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, AreaChart, Area, CartesianGrid 
} from "recharts";

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/members/")
      .then(res => res.json())
      .then(data => setMembers(data));

    fetch(`http://127.0.0.1:8000/api/attendance/?date=${today}`)
      .then(res => res.json())
      .then(data => setAttendance(data));
  }, [today]);

  // --- STATS LOGIC ---
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.subscription_status === "Active").length;
  const inactiveMembers = totalMembers - activeMembers;

  // Pie Data (Sports)
  const sportStats = members.reduce((acc, m) => {
    const sport = m.sport_type || "Unknown";
    acc[sport] = (acc[sport] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(sportStats).map(([sport, count]) => ({ 
    name: sport, 
    value: count 
  }));

  // Growth Data (New Members per Month)
  const growthMap = {};
  members.forEach(m => {
    if (!m.registration_date) return;
    const month = m.registration_date.slice(0, 7); // YYYY-MM
    growthMap[month] = (growthMap[month] || 0) + 1;
  });

  const growthData = Object.keys(growthMap)
    .sort()
    .map(month => ({
      month,
      members: growthMap[month],
    }));

  // Attendance Data
  const presentCount = attendance.filter(a => a.status === "Present").length;
  const absentCount = attendance.filter(a => a.status === "Absent").length;
  const notMarkedCount = totalMembers - presentCount - absentCount;

  const barData = [
    { name: "Present", count: presentCount, color: "#10b981" }, // Emerald-500
    { name: "Absent", count: absentCount, color: "#ef4444" },   // Red-500
    { name: "Pending", count: notMarkedCount, color: "#f59e0b" } // Amber-500
  ];

  // Colors for Pie
  const PIE_COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b"];

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50/50 space-y-8 font-sans text-slate-800">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, Administrator.</p>
        </div>
        <div className="text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm text-gray-500 border">
            📅 Today: {today}
        </div>
      </div>

      {/* 2. STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Members" 
            value={totalMembers} 
            icon="👥" 
            color="bg-blue-500" 
            trend="+12% this month"
        />
        <StatCard 
            title="Active Members" 
            value={activeMembers} 
            icon="⚡" 
            color="bg-emerald-500" 
            trend="Stable"
        />
        <StatCard 
            title="Inactive Members" 
            value={inactiveMembers} 
            icon="💤" 
            color="bg-rose-500" 
            trend="Needs Attention"
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GROWTH CHART (Area Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                📈 Monthly Registration Growth
            </h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                        <defs>
                            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="members" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorMembers)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PIE CHART (Donut Style) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-2 text-center">Sports Distribution</h2>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={pieData} 
                    innerRadius={60} // Makes it a Donut
                    outerRadius={80} 
                    paddingAngle={5}
                    dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text in Donut */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="block text-3xl font-bold text-gray-800">{totalMembers}</span>
                    <span className="text-xs text-gray-400 uppercase">Total</span>
                </div>
            </div>
          </div>
        </div>

        {/* ATTENDANCE BAR CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Today's Attendance</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}> {/* Rounded tops */}
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:scale-105 transition-transform duration-300">
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
        <p className="text-xs text-gray-400 mt-2 font-medium">{trend}</p>
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white shadow-lg ${color}`}>
        {icon}
      </div>
    </div>
  );
}

// Custom Tooltip for Charts (Cleaner Look)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-sm">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-blue-200">
            {payload[0].name}: <span className="font-bold text-white">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };