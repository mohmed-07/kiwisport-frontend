import React, { useEffect, useState, useMemo } from "react";

// --- CONSTANTS ---
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

export default function Payments() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [sportFilter, setSportFilter] = useState("All"); 
  const [search, setSearch] = useState("");
  
  const [editingPayment, setEditingPayment] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch ALL Members (We will filter them in the UI later)
  useEffect(() => {
    // FIX: Removed "?sport_type=..." query. We fetch everyone once.
    fetch(`${API_URL}/members/`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error("Error fetching members:", err));
  }, []); // Run once on mount

  // 2. Fetch Payments for Selected Month
  useEffect(() => {
    fetch(`${API_URL}/payments/`) 
      .then(res => res.json())
      .then(data => {
        // Filter payments to match the selected month
        const monthlyPayments = data.filter(p => p.month.startsWith(selectedMonth));
        setPayments(monthlyPayments);
      })
      .catch(err => console.error("Error fetching payments:", err));
  }, [selectedMonth]);

  // 3. MERGE & FILTER DATA (The Fix is Here)
  const rows = useMemo(() => {
    return members
      // FIX 1: Filter by Search
      .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
      // FIX 2: Filter by Sport (Client-Side)
      .filter(m => sportFilter === "All" || m.sport_type === sportFilter)
      .map(member => {
        const payment = payments.find(p => p.member === member.id);
        return {
          ...member,
          payment: payment || null,
          status: payment ? payment.status : "Unpaid"
        };
      });
  }, [members, payments, search, sportFilter]); // Re-run when sportFilter changes

  // 4. Stats Calculation
  const stats = useMemo(() => {
    // Calculate revenue only for displayed rows (or all rows if you prefer)
    // Here we calculate totals based on the visible filtered list
    const totalRevenue = rows.reduce((acc, curr) => acc + Number(curr.payment?.amount || 0), 0);
    const paidCount = rows.filter(r => r.status === "Paid").length;
    const unpaidCount = rows.filter(r => r.status === "Unpaid").length;
    return { totalRevenue, paidCount, unpaidCount };
  }, [rows]);

  // --- HANDLERS ---
  const openEditModal = (row) => {
    setEditingPayment({
      memberId: row.id,
      memberName: row.name,
      sportType: row.sport_type,
      id: row.payment?.id || null,
      amount: row.payment?.amount || "",
      status: row.payment?.status || "Paid", 
      assurance: row.payment?.assurance || false,
      passport: row.payment?.passport || false,
    });
    setIsModalOpen(true);
  };

  const handleSavePayment = (paymentData) => {
    const isNew = !paymentData.id;
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `${API_URL}/payments/` : `${API_URL}/payments/${paymentData.id}/`;

    const payload = {
        member: paymentData.memberId,
        month: `${selectedMonth}-01`,
        status: paymentData.status,
        amount: Number(paymentData.amount),
        assurance: paymentData.assurance,
        passport: paymentData.passport
    };

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    })
    .then((savedRecord) => {
        setPayments(prev => {
            if (isNew) return [...prev, savedRecord];
            return prev.map(p => p.id === savedRecord.id ? savedRecord : p);
        });
        setIsModalOpen(false);
    })
    .catch(err => alert("Save failed: " + err.message));
  };

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50/50 flex flex-col space-y-8 font-sans text-slate-800">
      
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col justify-center">
             <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Payments
             </h1>
             <p className="text-gray-400 mt-1">Monthly Revenue Tracking</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-100 text-green-600 rounded-full text-2xl">💰</div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue} <span className="text-sm font-normal text-gray-400">DH</span></p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full text-2xl">✅</div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Paid Members</p>
                <p className="text-2xl font-bold text-gray-800">{stats.paidCount}</p>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-red-100 text-red-600 rounded-full text-2xl">⚠️</div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{stats.unpaidCount}</p>
            </div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
        
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-transparent focus-within:bg-white focus-within:border-blue-200 transition-all">
            <span className="text-gray-400">📅</span>
            <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer"
            />
        </div>
        
        <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>

        {/* Sport Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Karate", "Gym", "Football"].map(sport => (
                <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        sportFilter === sport 
                        ? "bg-slate-800 text-white shadow-lg shadow-slate-300" 
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                    {sport}
                </button>
            ))}
        </div>

        {/* Search */}
        <div className="flex-grow flex justify-end">
            <div className="relative w-full max-w-xs">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                    type="text"
                    placeholder="Search member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
            </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-grow overflow-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 pb-2 text-left font-semibold">Member</th>
              <th className="px-4 pb-2 text-left font-semibold">Sport</th>
              <th className="px-4 pb-2 text-center font-semibold">Status</th>
              <th className="px-4 pb-2 text-center font-semibold">Amount</th>
              <th className="px-4 pb-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr 
                key={row.id} 
                className="bg-white hover:bg-blue-50/50 shadow-sm hover:shadow-md transition-all duration-200 group rounded-xl"
              >
                <td className="p-4 rounded-l-xl border-l-4 border-transparent hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarColor(row.name)}`}>
                            {row.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700">{row.name}</span>
                    </div>
                </td>
                <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getSportColor(row.sport_type)}`}>
                        {row.sport_type}
                    </span>
                </td>
                <td className="p-4 text-center">
                   <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        row.status === "Paid" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${row.status === "Paid" ? "bg-green-500" : "bg-red-500"}`}></span>
                        {row.status}
                    </div>
                </td>
                <td className="p-4 text-center font-mono font-medium text-gray-600">
                   {row.payment ? `${row.payment.amount} DH` : "-"}
                </td>
                <td className="p-4 text-right rounded-r-xl">
                  <button 
                    onClick={() => openEditModal(row)}
                    className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                  >
                    Edit / Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="text-center p-10 text-gray-400">No members found.</div>}
      </div>

      {/* MODAL */}
      {isModalOpen && editingPayment && (
        <PaymentModal 
          data={editingPayment} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSavePayment} 
        />
      )}
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ data, onClose, onSave }) {
    const [formData, setFormData] = useState(data);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.amount) {
            alert("Please enter an amount.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">{formData.memberName}</h2>
                    <p className="opacity-80 text-sm uppercase tracking-widest mt-1">{formData.sportType}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Payment Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 font-bold">DH</span>
                            <input 
                                type="number" 
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none font-bold text-lg text-gray-700"
                                value={formData.amount}
                                onChange={(e) => handleChange("amount", e.target.value)}
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={() => handleChange("status", "Paid")}
                                className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.status === "Paid" ? "bg-green-100 text-green-700 border-2 border-green-500" : "bg-gray-50 text-gray-400 border border-gray-100"}`}
                            >Paid</button>
                            <button 
                                type="button"
                                onClick={() => handleChange("status", "Unpaid")}
                                className={`flex-1 py-2 rounded-xl font-bold transition-all ${formData.status === "Unpaid" ? "bg-red-100 text-red-700 border-2 border-red-500" : "bg-gray-50 text-gray-400 border border-gray-100"}`}
                            >Unpaid</button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" checked={formData.assurance} onChange={(e) => handleChange("assurance", e.target.checked)} />
                            <span className="text-gray-600 font-medium">Insurance Fee</span>
                        </label>
                        {formData.sportType === "Karate" && (
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" checked={formData.passport} onChange={(e) => handleChange("passport", e.target.checked)} />
                                <span className="text-gray-600 font-medium">Passport Fee</span>
                            </label>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}