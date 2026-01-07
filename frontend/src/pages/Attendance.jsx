import { useEffect, useState, useMemo } from "react";

// --- HELPERS ---
const API_URL = "http://127.0.0.1:8000/api";

const getSportColor = (sport) => {
  switch(sport?.toLowerCase()) {
    case 'karate': return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'gym': return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'football': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getAvatarColor = (name) => {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
  const index = name ? name.length % colors.length : 0;
  return colors[index];
};

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [sportFilter, setSportFilter] = useState(""); // Default is empty (All)
  const [attendanceList, setAttendanceList] = useState([]);
  
  const isToday = date === today;

  // --- FETCH DATA ---
  useEffect(() => {
    // FIX: We fetch ALL members (removed sportFilter from URL) to handle filtering locally
    Promise.all([
      fetch(`${API_URL}/members/`).then(res => res.json()),
      fetch(`${API_URL}/attendance/?date=${date}`).then(res => res.json())
    ])
    .then(([membersData, attendanceData]) => {
      const merged = membersData.map(member => {
        const record = attendanceData.find(a => a.member === member.id);
        return {
          member_id: member.id,
          member_name: member.name,
          sport_type: member.sport_type,
          status: record ? record.status : "NOT MARKED",
          attendance_id: record ? record.id : null,
        };
      });
      setAttendanceList(merged);
    })
    .catch(err => console.error("Failed to fetch data", err));
  }, [date]); // Only re-run when DATE changes, not sport

  // --- FILTERING LOGIC ---
  // FIX: We filter the list here in JavaScript. This guarantees it works.
  const filteredList = useMemo(() => {
    if (!sportFilter) return attendanceList;
    return attendanceList.filter(item => item.sport_type === sportFilter);
  }, [attendanceList, sportFilter]);

  // --- CALCULATE STATS ---
  // FIX: Stats now calculate based on the FILTERED list, so numbers update when you filter
  const stats = useMemo(() => {
    return {
      total: filteredList.length,
      present: filteredList.filter(a => a.status === "Present").length,
      absent: filteredList.filter(a => a.status === "Absent").length,
      pending: filteredList.filter(a => a.status === "NOT MARKED").length,
    };
  }, [filteredList]);

  // --- HANDLE UPDATE ---
  const updateAttendance = (memberId, newStatus) => {
    // Optimistic Update
    setAttendanceList(prev => 
      prev.map(a => a.member_id === memberId ? { ...a, status: newStatus } : a)
    );

    fetch(`${API_URL}/attendance/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member: memberId,
        date: date,
        status: newStatus,
      }),
    })
    .then(res => res.json())
    .then(data => {
      setAttendanceList(prev => 
        prev.map(a => a.member_id === memberId ? { ...a, attendance_id: data.id } : a)
      );
    })
    .catch(err => alert("Failed to save attendance"));
  };

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50/50 flex flex-col space-y-8 font-sans text-slate-800">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Daily Attendance
            </h1>
            <p className="text-gray-400 mt-1">Track member presence</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-gray-400 pl-2">📅</span>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="bg-transparent font-bold text-gray-700 outline-none p-1 cursor-pointer"
            />
        </div>
      </div>

      {/* 2. STATS BAR (Updates based on Filter) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatCard label="Total Expected" count={stats.total} color="bg-blue-100 text-blue-700" />
         <StatCard label="Present" count={stats.present} color="bg-green-100 text-green-700" icon="✅"/>
         <StatCard label="Absent" count={stats.absent} color="bg-red-100 text-red-700" icon="❌"/>
         <StatCard label="Pending" count={stats.pending} color="bg-gray-100 text-gray-600" icon="⏳"/>
      </div>

      {/* 3. FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["", "Karate", "Gym", "Football"].map(sport => (
            <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    sportFilter === sport 
                    ? "bg-slate-800 text-white shadow-lg" 
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
            >
                {sport === "" ? "All Sports" : sport}
            </button>
        ))}
      </div>

      {/* 4. ATTENDANCE LIST (Uses filteredList) */}
      <div className="flex-grow overflow-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 pb-2 text-left font-semibold">Member</th>
              <th className="px-4 pb-2 text-left font-semibold">Sport</th>
              <th className="px-4 pb-2 text-center font-semibold">Status</th>
              <th className="px-4 pb-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr 
                key={item.member_id} 
                className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
              >
                {/* Member */}
                <td className="p-4 rounded-l-xl">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarColor(item.member_name)}`}>
                            {item.member_name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700">{item.member_name}</span>
                    </div>
                </td>

                {/* Sport */}
                <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getSportColor(item.sport_type)}`}>
                        {item.sport_type}
                    </span>
                </td>

                {/* Status Badge */}
                <td className="p-4 text-center">
                    <StatusBadge status={item.status} />
                </td>

                {/* Action Buttons */}
                <td className="p-4 text-right rounded-r-xl">
                  {isToday ? (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => updateAttendance(item.member_id, "Present")}
                            className={`p-2 rounded-lg transition-all shadow-sm ${
                                item.status === "Present" 
                                ? "bg-green-600 text-white shadow-green-200" 
                                : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                            }`}
                            title="Mark Present"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>

                        <button 
                            onClick={() => updateAttendance(item.member_id, "Absent")}
                            className={`p-2 rounded-lg transition-all shadow-sm ${
                                item.status === "Absent" 
                                ? "bg-red-600 text-white shadow-red-200" 
                                : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                            }`}
                            title="Mark Absent"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Read Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredList.length === 0 && (
            <div className="text-center py-12 text-gray-400">No members found.</div>
        )}
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (Same as before) ---

function StatCard({ label, count, color, icon }) {
    return (
        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${color}`}>
            <div className="text-2xl font-bold flex items-center gap-2">
                {icon} {count}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    if (status === "Present") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Present
            </span>
        );
    }
    if (status === "Absent") {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> Absent
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-dashed border-gray-300">
            Pending
        </span>
    );
}