import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [resturant, setResturant] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   // Get user/admin/resturant from localStorage
  //   const storedUser = localStorage.getItem("user");
  //   const storedAdmin = localStorage.getItem("admin");
  //   const storedResturant = localStorage.getItem("resturant");
  //   setUser(storedUser ? JSON.parse(storedUser) : null);
  //   setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
  //   setResturant(storedResturant ? JSON.parse(storedResturant) : null);
  // }, [location]);

  useEffect(() => {
    // Get user/admin/resturant from localStorage
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");
    const storedResturant = localStorage.getItem("resturant");

    setUser(
      storedUser && storedUser !== "undefined" && storedUser !== ""
        ? JSON.parse(storedUser)
        : null
    );
    setAdmin(
      storedAdmin && storedAdmin !== "undefined" && storedAdmin !== ""
        ? JSON.parse(storedAdmin)
        : null
    );
    setResturant(
      storedResturant &&
        storedResturant !== "undefined" &&
        storedResturant !== ""
        ? JSON.parse(storedResturant)
        : null
    );
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("resturant");
    setUser(null);
    setAdmin(null);
    setResturant(null);
    navigate("/login");
  };

  // If admin or restaurant is logged in, show only Logout
  if (admin || resturant) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            FoodDelivery
          </Link>
          <div className="d-flex align-items-center ms-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Default: user or not logged in
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          FoodDelivery
        </Link>
        <div className="d-flex align-items-center ms-auto">
          {!user ? (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/signup">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-danger me-2"
                onClick={handleLogout}
              >
                Logout
              </button>
              <div className="position-relative">
                <FaUserCircle
                  size={32}
                  style={{ cursor: "pointer" }}
                  onClick={() => setDropdown((prev) => !prev)}
                />
                {dropdown && (
                  <div
                    className="position-absolute end-0 mt-2 py-2 bg-white border rounded shadow"
                    style={{ minWidth: 160, zIndex: 1000 }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdown(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setDropdown(false);
                        navigate("/orders");
                      }}
                    >
                      My Orders
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
