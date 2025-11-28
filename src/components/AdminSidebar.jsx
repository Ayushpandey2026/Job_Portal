import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link className="hover:bg-gray-700 rounded p-2" to="/admin/dashboard">
          Dashboard
        </Link>

        <Link className="hover:bg-gray-700 rounded p-2" to="/admin/users">
          Manage Users
        </Link>

        <Link className="hover:bg-gray-700 rounded p-2" to="/admin/jobs">
          Manage Jobs
        </Link>

        <Link className="hover:bg-gray-700 rounded p-2" to="/admin/analytics">
          Analytics
        </Link>
      </nav>
    </div>
  );
}
