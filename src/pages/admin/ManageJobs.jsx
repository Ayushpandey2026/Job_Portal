import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setJobs(res.data.jobs));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/jobs/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    fetchJobs();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-72 p-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

        <table className="w-full border shadow bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Recruiter</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => (
              <tr key={j._id} className="text-center">
                <td className="border p-3">{j.title}</td>
                <td className="border p-3">{j.company}</td>
                <td className="border p-3">{j.recruiter?.name}</td>

                <td className="border p-3">
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded"
                    onClick={() => deleteJob(j._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
