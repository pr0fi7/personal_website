import { useEffect, useState } from "react";
import axios from "axios";
// import "./admin.scss";

const API_URL = "http://127.0.0.1:8000/portfolios";
const ADMIN_PASSWORD = "mysecurepassword";  // Change this to a secure password!

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

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
      const headers = { "api-key": "mysecretadminkey" };  // Secure API key
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form, { headers });
      } else {
        await axios.post(API_URL, form, { headers });
      }
      setForm({ title: "", description: "", image: "" });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { "api-key": "mysecretadminkey" } });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description, image: item.image });
    setEditingId(item.id);
  };

  // Handle password authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      {/* Show login form if not authenticated */}
      {!isAuthenticated ? (
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
      ) : (
        <>
          {/* Show admin form only if authenticated */}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
            <input type="text" placeholder="Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required />
            <button type="submit">{editingId ? "Update" : "Add"}</button>
          </form>

          <h2>Existing Portfolio Items</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image} alt={item.title} width="100" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
