import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getMeApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await loginApi({ email: form.email, password: form.password });
      const user = await getMeApi();
      setUser(user);
      navigate("/admin/profile");
    } catch (e) {
      setErr(e?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center bg-light min-vh-90 pt-5">
      <div
        className="card shadow border-0 p-4 w-100 align-self-center"
        style={{ maxWidth: "500px", borderRadius: "12px" }}
      >
        <h4 className="text-center fw-bold mb-3">Admin Login</h4>

        {err && <div className="alert alert-danger small">{err}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="form-control"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
