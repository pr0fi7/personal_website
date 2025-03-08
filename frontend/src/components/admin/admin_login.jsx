import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { password });
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      console.log("Login successful, token stored!");
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
