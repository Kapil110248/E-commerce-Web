import React, { useState, useEffect } from "react";
import userService from "../../services/userService"; // ✅ use our service

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Backend se users fetch karo
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll(); // service se fetch
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      const updated = await userService.toggleBlock(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === updated._id ? { ...u, isBlocked: updated.isBlocked } : u
        )
      );
    } catch (err) {
      console.error("Toggle block failed", err);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filtered = users.filter((u) =>
    `${u.name} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container py-3">
      <h4 className="mb-3">Manage Users</h4>

      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <input
            className="form-control w-50"
            placeholder="Search users by name/email/role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-muted">Total: {filtered.length}</span>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge bg-info">{u.role}</span>
                  </td>
                  <td>
                    {u.isBlocked ? (
                      <span className="badge bg-danger">Blocked</span>
                    ) : (
                      <span className="badge bg-success">Active</span>
                    )}
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${
                        u.isBlocked ? "btn-success" : "btn-warning"
                      }`}
                      onClick={() => toggleBlock(u._id)}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
