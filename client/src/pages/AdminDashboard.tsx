import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import type { Book } from '../types/book';

interface Stats {
  totalBooks: number;
  totalUsers: number;
  activeBorrows: number;
  overdueTasks: number;
}

interface OverdueItem {
  task: {
    _id: string;
    title: string;
    dueDate: string;
    relatedBook?: Book;
    user?: { name: string; email: string };
  };
  daysOverdue: number;
  fine: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [overdueList, setOverdueList] = useState<OverdueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, overdueRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/overdue'),
        ]);
        setStats(statsRes.data);
        setOverdueList(overdueRes.data);
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Books" value={stats.totalBooks} color="blue" />
          <StatCard label="Total Users" value={stats.totalUsers} color="green" />
          <StatCard label="Active Borrows" value={stats.activeBorrows} color="purple" />
          <StatCard label="Overdue" value={stats.overdueTasks} color="red" />
        </div>
      )}

      {/* Overdue Books Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Overdue Books & Fines</h2>
        {overdueList.length === 0 ? (
          <p className="text-gray-500">No overdue books</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Book</th>
                  <th className="text-left p-3">Due Date</th>
                  <th className="text-left p-3">Days Overdue</th>
                  <th className="text-left p-3">Fine</th>
                </tr>
              </thead>
              <tbody>
                {overdueList.map((item) => (
                  <tr key={item.task._id} className="border-t">
                    <td className="p-3">
                      <p className="font-medium">{item.task.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{item.task.user?.email}</p>
                    </td>
                    <td className="p-3">{item.task.relatedBook?.title || 'N/A'}</td>
                    <td className="p-3">{new Date(item.task.dueDate).toLocaleDateString()}</td>
                    <td className="p-3 text-red-600 font-medium">{item.daysOverdue} days</td>
                    <td className="p-3 text-red-700 font-bold">${item.fine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default AdminDashboard;
