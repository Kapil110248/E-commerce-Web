import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi, getMeApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function CustomerAuthPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerApi(form);
      } else {
        await loginApi({ email: form.email, password: form.password });
      }
      const user = await getMeApi();
      setUser(user);
      navigate("/customer/profile");
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          (isRegister ? "Registration failed" : "Login failed")
      );
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
        <h4 className="text-center fw-bold mb-3">
          {isRegister ? "Customer Registration" : "Customer Login"}
        </h4>

        {err && <div className="alert alert-danger small">{err}</div>}

        <form onSubmit={onSubmit}>
          {isRegister && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="form-control"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={onChange}
                  className="form-control"
                  placeholder="9876543210"
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="form-control"
              placeholder="you@example.com"
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
            {loading
              ? isRegister
                ? "Creating..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 small">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            className="btn btn-link p-0 small fw-semibold"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
