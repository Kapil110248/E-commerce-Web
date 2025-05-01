import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:4000/api/users");
      const users = res.data;
      const userMatch = users.find(
        (user) => user.email === form.email && user.password === form.password
      );
      if (userMatch) {
        alert("Login successful!");
      } else {
        alert("Invalid email or password.");
      }
    } catch (error) {
      alert("Login failed. Try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/users", form);
      alert("Registration successful!");
      setIsLogin(true);
    } catch (error) {
      alert("Registration failed. Email may already be used.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="form-container">
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span className="btn"
              style={{  cursor: "pointer" ,color:"green"}}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
