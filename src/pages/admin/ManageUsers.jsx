import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setUsers(res.data.users));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id, block) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${block ? "block" : "unblock"}/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    fetchUsers();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-72 p-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        <table className="w-full border shadow-md bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="border p-3">{u.name}</td>
                <td className="border p-3">{u.email}</td>
                <td className="border p-3">{u.role}</td>
                <td className="border p-3">
                  {u.isBlocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>

                <td className="border p-3">
                  {u.isBlocked ? (
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded"
                      onClick={() => toggleBlock(u._id, false)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="bg-red-600 text-white px-4 py-1 rounded"
                      onClick={() => toggleBlock(u._id, true)}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
