import { useEffect, useState } from "react";
import { getMeApi, logoutApi } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [me, setMe] = useState(user);
  const [loading, setLoading] = useState(!user); // agar context me user hai to skip loading
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) return; // agar context me user already hai, API call skip

    (async () => {
      try {
        setLoading(true);
        const u = await getMeApi();

        if (!u || u.role !== "customer") {
          navigate("/login-customer", { replace: true });
          return;
        }

        setMe(u);
        setUser(u);
      } catch (err) {
        console.error("❌ CustomerProfile load failed:", err);
        setError("Failed to load profile. Please login again.");
        navigate("/login-customer", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate, setUser]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout failed:", err);
    } finally {
      setUser(null);
      setMe(null);
      navigate("/auth", { replace: true });
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: 520 }}>
        <h2 className="mb-4 text-center text-primary">👤 Customer Profile</h2>

        <div className="mb-3">
          <p><strong>Name:</strong> {me?.name || "-"}</p>
          <p><strong>Email:</strong> {me?.email || "-"}</p>
          <p><strong>Mobile:</strong> {me?.mobile || "-"}</p>
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/my-orders")}
          >
            📦 My Orders
          </button>

          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
