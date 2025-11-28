import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setStats(res.data.stats));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const pieData = [
    { name: "Recruiters", value: stats.totalRecruiters },
    { name: "Applicants", value: stats.totalApplicants },
  ];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-72 p-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>

        <div className="grid grid-cols-2 gap-10">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx={150}
                cy={150}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                <Cell fill="#6366F1" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Platform Stats</h3>

            <LineChart width={400} height={300} data={[
              { name: "Users", value: stats.totalUsers },
              { name: "Jobs", value: stats.totalJobs },
              { name: "Applications", value: stats.totalApplications }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} />
            </LineChart>
          </div>

        </div>
      </div>
    </div>
  );
}
