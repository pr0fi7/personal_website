import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "mysecurepassword";  // Change this to a secure password!

const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("isAdmin", "true");  // Save login state
      navigate("/admin");  // Redirect to admin panel
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="password" 
          placeholder="Enter admin password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
