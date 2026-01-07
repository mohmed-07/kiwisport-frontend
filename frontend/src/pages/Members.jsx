import { useEffect, useState } from "react";

// --- CONSTANTS & HELPERS ---
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

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [newMember, setNewMember] = useState({
    name: "",
    phone_number: "",
    date_of_birth: "",
    registration_date: new Date().toISOString().split('T')[0], // Default to today
    passport_number: "",
    sport_type: "",
    image: null
  });

  useEffect(() => {
    fetch(`${API_URL}/members/`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error(err));
  }, []);

  // --- ACTIONS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`${API_URL}/members/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      alert("Error deleting member");
    }
  };

  const handleAddSave = async () => {
    try {
      const formData = new FormData();
      for (const key in newMember) {
        if (newMember[key]) formData.append(key, newMember[key]);
      }
      const res = await fetch(`${API_URL}/members/`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMembers([...members, data]);
      setNewMember({ name: "", phone_number: "", date_of_birth: "", registration_date: "", passport_number: "", sport_type: "", image: null });
      setShowAddModal(false);
    } catch (err) {
      alert("Error adding member");
    }
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();
      for (const key in editingMember) {
        // Only append if it's not a URL string (meaning it's a new file) or if it's text
        if (editingMember[key]) {
            // If image is string (url), don't send it. If object (file), send it.
            if (key === 'image' && typeof editingMember[key] === 'string') continue;
            formData.append(key, editingMember[key]);
        }
      }
      const res = await fetch(`${API_URL}/members/${editingMember.id}/`, { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMembers(members.map((m) => (m.id === data.id ? data : m)));
      setEditingMember(null);
    } catch (err) {
      alert("Error updating member");
    }
  };

  // --- FILTERING ---
  const filteredMembers = members
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .filter(m => sportFilter === "All" || m.sport_type === sportFilter);

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50/50 flex flex-col space-y-8 font-sans text-slate-800">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Team Members
            </h1>
            <p className="text-gray-400 mt-1">
                Manage your athletes ({filteredMembers.length} active)
            </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <span>+</span> Add New Member
        </button>
      </div>

      {/* 2. FILTERS BAR */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
        </div>

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
      </div>

      {/* 3. FLOATING ROW TABLE */}
      <div className="flex-grow overflow-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-4 pb-2 text-left font-semibold">Member</th>
              <th className="px-4 pb-2 text-left font-semibold">Contact</th>
              <th className="px-4 pb-2 text-left font-semibold">Sport</th>
              <th className="px-4 pb-2 text-center font-semibold">Registration</th>
              <th className="px-4 pb-2 text-center font-semibold">Status</th>
              <th className="px-4 pb-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr 
                key={m.id} 
                className="bg-white hover:bg-blue-50/30 shadow-sm hover:shadow-md transition-all duration-200 group rounded-xl"
              >
                {/* Member Info + Avatar */}
                <td className="p-4 rounded-l-xl border-l-4 border-transparent hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-3">
                        {m.image ? (
                             <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarColor(m.name)}`}>
                                {m.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div className="font-bold text-gray-800">{m.name}</div>
                            <div className="text-xs text-gray-400">ID: #{m.id}</div>
                        </div>
                    </div>
                </td>

                {/* Contact */}
                <td className="p-4">
                    <div className="text-sm font-medium text-gray-700">{m.phone_number}</div>
                    <div className="text-xs text-gray-400">Pass: {m.passport_number || "N/A"}</div>
                </td>
                
                {/* Sport Badge */}
                <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getSportColor(m.sport_type)}`}>
                        {m.sport_type || "None"}
                    </span>
                </td>

                {/* Dates */}
                <td className="p-4 text-center">
                    <div className="text-sm text-gray-600">{m.registration_date}</div>
                    <div className="text-xs text-gray-400">Since Joining</div>
                </td>

                {/* Status */}
                <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Active
                    </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right rounded-r-xl">
                  <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => setEditingMember(m)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button 
                        onClick={() => handleDelete(m.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                    >
                        🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="text-4xl mb-2">🤷‍♂️</div>
                <p>No members found.</p>
            </div>
        )}
      </div>

      {/* --- MODAL (Reused for Add & Edit) --- */}
      {(showAddModal || editingMember) && (
        <MemberModal
          member={editingMember || newMember}
          setMember={editingMember ? setEditingMember : setNewMember}
          onClose={() => { setShowAddModal(false); setEditingMember(null); }}
          onSave={editingMember ? handleEditSave : handleAddSave}
          title={editingMember ? "Edit Member" : "Add New Member"}
        />
      )}
    </div>
  );
}

// --- BEAUTIFUL MODAL COMPONENT ---
function MemberModal({ member, setMember, onClose, onSave, title }) {
  const handleChange = (e) => {
     const { name, value, files } = e.target;
     setMember(prev => ({
        ...prev,
        [name]: files ? files[0] : value
     }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Modal Header */}
        <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Form Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Left Col */}
           <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input name="name" type="text" value={member.name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                <input name="phone_number" type="text" value={member.phone_number} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+212..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Passport (Optional)</label>
                <input name="passport_number" type="text" value={member.passport_number} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="AB123456" />
              </div>
           </div>

           {/* Right Col */}
           <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sport Type</label>
                <select name="sport_type" value={member.sport_type} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">Select Sport...</option>
                    <option value="Karate">Karate</option>
                    <option value="Gym">Gym</option>
                    <option value="Football">Football</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birth Date</label>
                    <input name="date_of_birth" type="date" value={member.date_of_birth} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Joined Date</label>
                    <input name="registration_date" type="date" value={member.registration_date} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profile Photo</label>
                <input name="image" type="file" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button onClick={onSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all">Save Changes</button>
        </div>

      </div>
    </div>
  );
}