import { useEffect, useState } from "react";
import { getMeApi, logoutApi } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [me, setMe] = useState(user);

  useEffect(() => {
    (async () => {
      try {
        const u = await getMeApi();
        setMe(u);
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await logoutApi();
    setUser(null);
    navigate("/login");
  };

  if (!me) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 520 }}>
        <h2 className="mb-4 text-center">Admin Profile</h2>
        <p><strong>Name:</strong> {me.name}</p>
        <p><strong>Email:</strong> {me.email}</p>
        <p><strong>Mobile:</strong> {me.mobile || "-"}</p>
        <p><strong>Role:</strong> {me.role}</p>
        <button className="btn btn-warning mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
