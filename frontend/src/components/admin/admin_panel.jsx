import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/portfolios";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState(""); // For login
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch items only after login
  useEffect(() => {
    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form, { headers });
      } else {
        await axios.post(API_URL, form, { headers });
      }
      setForm({ title: "", description: "", image: "", link: "" });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.delete(`${API_URL}/${id}`, { headers });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    });
    setEditingId(item.id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/admin/login", { password });
      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow">
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
  }

  // Admin panel view
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel</h1>

      {/* Form card */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h3 className="card-title mb-3">
            {editingId ? "Edit Portfolio Item" : "Add Portfolio Item"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Link"
                value={form.link}
                onChange={(e) =>
                  setForm({ ...form, link: e.target.value })
                }
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success">
                {editingId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Portfolio items */}
      <h2 className="mb-3">Existing Portfolio Items</h2>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
