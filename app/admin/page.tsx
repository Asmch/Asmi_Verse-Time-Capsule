"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { Session } from "next-auth";

const sections = [
  { key: "dashboard", label: "Dashboard" },
  { key: "capsules", label: "Capsules" },
  { key: "users", label: "Users" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

type Capsule = {
  _id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  timeLock: string;
  message?: string;
  mediaUrl?: string;
  createdAt?: string;
};

type User = {
  _id: string;
  name?: string;
  email: string;
  isBanned?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
};

function CapsulesTable() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selected, setSelected] = useState<Capsule | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCapsules = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/capsules?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
    const data = await res.json();
    if (data.success) {
      setCapsules(data.capsules);
      setTotal(data.total);
    } else {
      setCapsules([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCapsules(); }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this capsule?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/capsules?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Capsule deleted successfully');
        fetchCapsules();
      } else {
        alert('Failed to delete capsule: ' + data.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete capsule');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <input
          className="px-3 py-2 rounded bg-[#23272b] border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search capsules..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {loading ? (
        <div className="text-purple-300">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#181a20] rounded-lg">
            <thead>
              <tr className="text-purple-200 text-left">
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Recipient</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Unlock Date</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {capsules.map((c) => (
                <tr key={c._id} className="border-b border-purple-400/10 hover:bg-purple-900/10">
                  <td className="py-2 px-3 font-semibold text-purple-100">{c.title}</td>
                  <td className="py-2 px-3">{c.recipientName}</td>
                  <td className="py-2 px-3">{c.recipientEmail}</td>
                  <td className="py-2 px-3">{new Date(c.timeLock).toLocaleString()}</td>
                  <td className="py-2 px-3">{new Date(c.timeLock) > new Date() ? 'Locked' : 'Unlocked'}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="text-blue-400 underline" onClick={() => { setSelected(c); setModalOpen(true); }}>View</button>
                    <button className="text-red-400 underline" onClick={() => handleDelete(c._id)} disabled={deleting}>Delete</button>
                    <button className="text-yellow-400 underline" onClick={() => alert('Flag action coming soon')}>Flag</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-purple-700/30 text-purple-100 disabled:opacity-50">Prev</button>
        <span className="text-purple-200">Page {page} of {Math.ceil(total / limit) || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total} className="px-3 py-1 rounded bg-purple-700/30 text-purple-100 disabled:opacity-50">Next</button>
      </div>
      {/* Capsule Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#23272b] rounded-xl p-8 max-w-lg w-full shadow-2xl relative">
            <button className="absolute top-2 right-2 text-purple-300 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-purple-200 mb-4">{selected.title}</h2>
            <div className="mb-2 text-purple-100"><b>Recipient:</b> {selected.recipientName}</div>
            <div className="mb-2 text-purple-100"><b>Email:</b> {selected.recipientEmail}</div>
            <div className="mb-2 text-purple-100"><b>Unlock Date:</b> {new Date(selected.timeLock).toLocaleString()}</div>
            <div className="mb-2 text-purple-100"><b>Status:</b> {new Date(selected.timeLock) > new Date() ? 'Locked' : 'Unlocked'}</div>
            <div className="mb-2 text-purple-100"><b>Message:</b> <div className="whitespace-pre-line bg-black/20 rounded p-2 mt-1">{selected.message}</div></div>
            {selected.mediaUrl && (
              <div className="mb-2">
                <img src={selected.mediaUrl} alt="Capsule Media" className="rounded-lg max-h-40 object-cover border border-purple-400/20 shadow-md" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selected, setSelected] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [banning, setBanning] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.users);
      setTotal(data.total);
    } else {
      setUsers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search, page]);

  const handleBan = async (id: string) => {
    if (!window.confirm("Ban this user?")) return;
    setBanning(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, action: 'ban' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('User banned successfully');
        fetchUsers();
      } else {
        alert('Failed to ban user: ' + data.error);
      }
    } catch (error) {
      console.error('Ban error:', error);
      alert('Failed to ban user');
    } finally {
      setBanning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4 gap-2">
        <input
          className="px-3 py-2 rounded bg-[#23272b] border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search users..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      {loading ? (
        <div className="text-purple-300">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#181a20] rounded-lg">
            <thead>
              <tr className="text-purple-200 text-left">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-purple-400/10 hover:bg-purple-900/10">
                  <td className="py-2 px-3 font-semibold text-purple-100">{u.name || 'No Name'}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.isBanned ? 'Banned' : 'Active'}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="text-blue-400 underline" onClick={() => { setSelected(u); setModalOpen(true); }}>View</button>
                    <button className="text-red-400 underline" onClick={() => handleBan(u._id)} disabled={banning || u.isBanned}>Ban</button>
                    <button className="text-yellow-400 underline" onClick={() => alert('Warn action coming soon')}>Warn</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-purple-700/30 text-purple-100 disabled:opacity-50">Prev</button>
        <span className="text-purple-200">Page {page} of {Math.ceil(total / limit) || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total} className="px-3 py-1 rounded bg-purple-700/30 text-purple-100 disabled:opacity-50">Next</button>
      </div>
      {/* User Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#23272b] rounded-xl p-8 max-w-lg w-full shadow-2xl relative">
            <button className="absolute top-2 right-2 text-purple-300 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold text-purple-200 mb-4">{selected.name || 'No Name'}</h2>
            <div className="mb-2 text-purple-100"><b>Email:</b> {selected.email}</div>
            <div className="mb-2 text-purple-100"><b>Status:</b> {selected.isBanned ? 'Banned' : 'Active'}</div>
            <div className="mb-2 text-purple-100"><b>Admin:</b> {selected.isAdmin ? 'Yes' : 'No'}</div>
            <div className="mb-2 text-purple-100"><b>Created:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : 'N/A'}</div>
            {/* Add more user details as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardStats() {
  const [stats, setStats] = useState<{
    success?: boolean;
    totalCapsules?: number;
    totalUsers?: number;
    newCapsules?: number;
    newUsers?: number;
    recentCapsules?: Capsule[];
    recentUsers?: User[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/stats');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) return <div className="text-purple-300">Loading dashboard stats...</div>;
  if (error) return <div className="text-red-400">Error loading stats: {error}</div>;
  if (!stats?.success) return <div className="text-red-400">Failed to load stats: {stats?.error || 'Unknown error'}</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-[#23272b] rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-purple-200">{stats.totalCapsules || 0}</div>
        <div className="text-lg text-purple-300">Total Capsules</div>
      </div>
      <div className="bg-[#23272b] rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-purple-200">{stats.totalUsers || 0}</div>
        <div className="text-lg text-purple-300">Total Users</div>
      </div>
      <div className="bg-[#23272b] rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-purple-200">{stats.newCapsules || 0}</div>
        <div className="text-lg text-purple-300">New Capsules (7d)</div>
      </div>
      <div className="bg-[#23272b] rounded-xl p-6 shadow-lg flex flex-col items-center">
        <div className="text-4xl font-bold text-purple-200">{stats.newUsers || 0}</div>
        <div className="text-lg text-purple-300">New Users (7d)</div>
      </div>
      <div className="md:col-span-2 mt-8">
        <div className="text-xl font-bold text-purple-200 mb-2">Recent Capsules</div>
        <ul className="space-y-2">
          {(stats.recentCapsules ?? []).map((c) => (
            <li key={c._id} className="bg-black/20 rounded p-2 text-purple-100">
              <b>{c.title}</b> to {c.recipientName} ({c.recipientEmail}) — {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
            </li>
          ))}
          {(!stats.recentCapsules || stats.recentCapsules.length === 0) && (
            <li className="text-purple-300 italic">No recent capsules</li>
          )}
        </ul>
        <div className="text-xl font-bold text-purple-200 mt-8 mb-2">Recent Users</div>
        <ul className="space-y-2">
          {(stats.recentUsers ?? []).map((u) => (
            <li key={u._id} className="bg-black/20 rounded p-2 text-purple-100">
              <b>{u.name || 'No Name'}</b> ({u.email}) — {u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}
            </li>
          ))}
          {(!stats.recentUsers || stats.recentUsers.length === 0) && (
            <li className="text-purple-300 italic">No recent users</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function ReportsTable() {
  const [reports, setReports] = useState<{
    success?: boolean;
    flaggedCapsules: Capsule[];
    flaggedUsers: User[];
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/reports');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  if (loading) return <div className="text-purple-300">Loading reports...</div>;
  if (error) return <div className="text-red-400">Error loading reports: {error}</div>;
  if (!reports?.success) return <div className="text-red-400">Failed to load reports: {reports?.error || 'Unknown error'}</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="text-xl font-bold text-purple-200 mb-2">Flagged Capsules</div>
        <table className="min-w-full bg-[#181a20] rounded-lg mb-6">
          <thead>
            <tr className="text-purple-200 text-left">
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Recipient</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.flaggedCapsules.length === 0 && (
              <tr><td colSpan={3} className="text-purple-300 py-2 px-3">No flagged capsules</td></tr>
            )}
            {reports.flaggedCapsules.map((c: any) => (
              <tr key={c._id} className="border-b border-purple-400/10 hover:bg-purple-900/10">
                <td className="py-2 px-3 font-semibold text-purple-100">{c.title}</td>
                <td className="py-2 px-3">{c.recipientName}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button className="text-blue-400 underline" onClick={() => alert('View capsule')}>View</button>
                  <button className="text-red-400 underline" onClick={() => alert('Delete capsule')}>Delete</button>
                  <button className="text-green-400 underline" onClick={() => alert('Mark resolved')}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="text-xl font-bold text-purple-200 mb-2">Flagged Users</div>
        <table className="min-w-full bg-[#181a20] rounded-lg mb-6">
          <thead>
            <tr className="text-purple-200 text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.flaggedUsers.length === 0 && (
              <tr><td colSpan={3} className="text-purple-300 py-2 px-3">No flagged users</td></tr>
            )}
            {reports.flaggedUsers.map((u: any) => (
              <tr key={u._id} className="border-b border-purple-400/10 hover:bg-purple-900/10">
                <td className="py-2 px-3 font-semibold text-purple-100">{u.name || 'No Name'}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button className="text-blue-400 underline" onClick={() => alert('View user')}>View</button>
                  <button className="text-red-400 underline" onClick={() => alert('Ban user')}>Ban</button>
                  <button className="text-green-400 underline" onClick={() => alert('Mark resolved')}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPanel({ session }: { session: Session }) {
  return (
    <div className="max-w-lg mx-auto bg-[#23272b] rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Admin Settings</h2>
      <div className="mb-2 text-purple-100"><b>Name:</b> {session?.user?.name || 'N/A'}</div>
      <div className="mb-2 text-purple-100"><b>Email:</b> {session?.user?.email || 'N/A'}</div>
      <div className="mb-2 text-purple-100"><b>Admin:</b> Yes</div>
      <div className="mb-2 text-purple-100"><b>More settings coming soon...</b></div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Only allow access if user is admin
  if (status === "loading") return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  const isAdmin = (session?.user && (session.user as any).isAdmin) === true;
  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500 font-bold">Access Denied: Admins Only</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#181a20] to-[#23272b]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1d23] border-r border-purple-400/20 flex flex-col py-8 px-4">
        <h2 className="text-2xl font-extrabold text-purple-200 mb-8 text-center tracking-tight">Admin</h2>
        <nav className="flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`text-left px-4 py-2 rounded-lg font-semibold transition-all text-lg ${activeSection === section.key ? "bg-purple-600 text-white" : "text-purple-200 hover:bg-purple-700/20"}`}
              onClick={() => setActiveSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">
        {activeSection === "dashboard" && <DashboardStats />}
        {activeSection === "capsules" && <CapsulesTable />}
        {activeSection === "users" && <UsersTable />}
        {activeSection === "reports" && <ReportsTable />}
        {activeSection === "settings" && <SettingsPanel session={session} />}
      </main>
    </div>
  );
} 