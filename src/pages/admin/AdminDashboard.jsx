import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setStats(res.data.stats));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-72 p-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {!stats ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-gray-600">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-gray-600">Recruiters</h3>
              <p className="text-3xl font-bold">{stats.totalRecruiters}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-gray-600">Applicants</h3>
              <p className="text-3xl font-bold">{stats.totalApplicants}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border">
              <h3 className="text-gray-600">Jobs Posted</h3>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
