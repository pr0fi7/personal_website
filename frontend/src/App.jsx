import Test from "./Test";
import "./app.scss";
import Contact from "./components/contact/Contact";
import Cursor from "./components/cursor/Cursor";
import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import Parallax from "./components/parallax/Parallax";
import Portfolio from "./components/portfolio/Portfolio";
import Services from "./components/services/Services";
import AdminPanel from "./components/admin/admin_panel";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLogin from "./components/admin/admin_login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if admin is already logged in
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Portfolio Page */}
        <Route path="/" element={
              <div>
              {/* <Cursor /> */}
              <section id="Homepage">
                <Navbar />
                <Hero />
              </section>
              {/* <section id="Services">
                <Parallax type="services" />
              </section> */}
              {/* <section>
                <Services />
              </section> */}
              <section id="Portfolio">
                <Parallax type="portfolio" />
              </section>
              <Portfolio />
              <section id="Contact">
                <Contact />
              </section>

              {/* Framer Motion Crash Course */}
              {/* <Test/>
            <Test/> */}
            </div>
        } />

        {/* Admin Login Page (Protected) */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />}
        />

        {/* Admin Login Page */}
        <Route 
          path="/login" 
          element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

