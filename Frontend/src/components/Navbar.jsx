// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { 
//   FaUserCircle, 
//   FaSun, 
//   FaMoon, 
//   FaHome, 
//   FaInfoCircle, 
//   FaEnvelope,
//   FaBars,
//   FaTimes,
//   FaShoppingBag,
//   FaUserCog
// } from "react-icons/fa";

// const Navbar = () => {
//   const [user, setUser] = useState(null);
//   const [admin, setAdmin] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [dropdown, setDropdown] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });
  
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const navbarRef = useRef(null);

//   // Apply dark mode and handle clicks outside
//   useEffect(() => {
//     document.body.classList.toggle('dark-mode', darkMode);
//     document.body.classList.toggle('light-mode', !darkMode);
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));

//     const handleClickOutside = (event) => {
//       // Close dropdown if clicked outside
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdown(false);
//       }
      
//       // Close mobile menu if clicked outside navbar or menu
//       if (mobileMenuOpen && 
//           !navbarRef.current?.contains(event.target) && 
//           !mobileMenuRef.current?.contains(event.target)) {
//         setMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("touchstart", handleClickOutside);
    
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, [darkMode, mobileMenuOpen]);

//   // Check auth status on location change
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedAdmin = localStorage.getItem("admin");
//     const storedRestaurant = localStorage.getItem("restaurant");
//     setUser(storedUser ? JSON.parse(storedUser) : null);
//     setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
//     setRestaurant(storedRestaurant ? JSON.parse(storedRestaurant) : null);
//   }, [location]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("admin");
//     localStorage.removeItem("restaurant");
//     setUser(null);
//     setAdmin(null);
//     setRestaurant(null);
//     setDropdown(false);
//     setMobileMenuOpen(false);
//     navigate("/login");
//   };

//   const toggleDarkMode = () => setDarkMode(!darkMode);
//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

//   // Style classes based on dark mode
//   const navbarClass = darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light";
//   const textClass = darkMode ? "text-white" : "text-dark";
//   const btnOutlineClass = darkMode ? "btn-outline-light" : "btn-outline-dark";
//   const dropdownBgClass = darkMode ? "bg-dark" : "bg-light";
//   const mobileMenuClass = darkMode ? "bg-dark" : "bg-light";

//   // Admin/Restaurant view
//   if (admin || restaurant) {
//     return (
//       <nav className={`navbar navbar-expand-lg ${navbarClass} shadow-sm`} ref={navbarRef}>
//         <div className="container-fluid">
//           <Link className={`navbar-brand fw-bold ${textClass}`} to="/">
//             <span className="text-primary">Food</span>Delivery
//           </Link>
          
//           <div className="d-flex align-items-center">
//             <button className={`btn ${btnOutlineClass} me-3`} onClick={toggleDarkMode}>
//               {darkMode ? <FaSun className="fs-5" /> : <FaMoon className="fs-5" />}
//             </button>
//             <button className={`btn ${btnOutlineClass}`} onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   // Main Navbar
//   return (
//     <>
//       <nav className={`navbar navbar-expand-lg ${navbarClass} shadow-sm sticky-top`} ref={navbarRef}>
//         <div className="container-fluid">
//           <Link className={`navbar-brand fw-bold ${textClass}`} to="/">
//             <span className="text-primary">Food</span>Delivery
//           </Link>
          
//           {/* Mobile menu button */}
//           <button 
//             className={`navbar-toggler ${textClass} border-0`}
//             onClick={toggleMobileMenu}
//             aria-label="Toggle navigation"
//             aria-expanded={mobileMenuOpen}
//           >
//             {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>

//           {/* Desktop menu */}
//           <div className="collapse navbar-collapse">
//             <div className="navbar-nav me-auto">
//               <NavLink to="/" text="Home" icon={<FaHome />} textClass={textClass} />
//               <NavLink to="/about" text="About" icon={<FaInfoCircle />} textClass={textClass} />
//               <NavLink to="/contact" text="Contact" icon={<FaEnvelope />} textClass={textClass} />
//             </div>

//             <div className="d-flex align-items-center ms-4">
//               <ThemeToggle 
//                 darkMode={darkMode} 
//                 toggleDarkMode={toggleDarkMode} 
//                 btnOutlineClass={btnOutlineClass} 
//               />
//               <AuthSection 
//                 user={user} 
//                 textClass={textClass} 
//                 btnOutlineClass={btnOutlineClass} 
//                 handleLogout={handleLogout} 
//                 dropdownBgClass={dropdownBgClass} 
//                 dropdownRef={dropdownRef} 
//                 dropdown={dropdown} 
//                 setDropdown={setDropdown} 
//                 handleNavigation={(path) => {
//                   setDropdown(false);
//                   navigate(path);
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile menu - uses Bootstrap offcanvas pattern */}
//       <div 
//         className={`offcanvas offcanvas-start ${mobileMenuClass} ${mobileMenuOpen ? 'show' : ''}`} 
//         tabIndex="-1"
//         ref={mobileMenuRef}
//         style={{ 
//           visibility: mobileMenuOpen ? 'visible' : 'hidden',
//           width: '75%'
//         }}
//       >
//         <div className="offcanvas-body d-flex flex-column">
//           <MobileNavLink 
//             to="/" 
//             text="Home" 
//             icon={<FaHome />} 
//             textClass={textClass} 
//             onClick={toggleMobileMenu} 
//           />
//           <MobileNavLink 
//             to="/about" 
//             text="About Us" 
//             icon={<FaInfoCircle />} 
//             textClass={textClass} 
//             onClick={toggleMobileMenu} 
//           />
//           <MobileNavLink 
//             to="/contact" 
//             text="Contact" 
//             icon={<FaEnvelope />} 
//             textClass={textClass} 
//             onClick={toggleMobileMenu} 
//           />

//           <div className="mt-auto pt-3 border-top">
//             <ThemeToggle 
//               darkMode={darkMode} 
//               toggleDarkMode={toggleDarkMode} 
//               btnOutlineClass={btnOutlineClass} 
//               fullWidth 
//             />

//             {!user ? (
//               <div className="d-flex flex-column gap-2 mt-3">
//                 <Link 
//                   className={`btn ${btnOutlineClass}`} 
//                   to="/login"
//                   onClick={toggleMobileMenu}
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   className="btn btn-primary" 
//                   to="/signup"
//                   onClick={toggleMobileMenu}
//                 >
//                   Sign Up
//                 </Link>
//               </div>
//             ) : (
//               <div className="mt-3">
//                 <button
//                   className={`btn ${btnOutlineClass} w-100 mb-2`}
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//                 <MobileDropdownItem 
//                   icon={<FaUserCog />}
//                   text="Profile"
//                   onClick={() => {
//                     toggleMobileMenu();
//                     navigate("/profile");
//                   }}
//                   textClass={textClass}
//                 />
//                 <MobileDropdownItem 
//                   icon={<FaShoppingBag />}
//                   text="My Orders"
//                   onClick={() => {
//                     toggleMobileMenu();
//                     navigate("/orders");
//                   }}
//                   textClass={textClass}
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Backdrop when mobile menu is open */}
//       {mobileMenuOpen && (
//         <div 
//           className="offcanvas-backdrop fade show" 
//           onClick={toggleMobileMenu}
//           style={{ zIndex: 1040 }}
//         />
//       )}
//     </>
//   );
// };

// // Reusable components
// const NavLink = ({ to, text, icon, textClass }) => (
//   <Link 
//     className={`nav-link ${textClass} mx-2 d-flex align-items-center`} 
//     to={to}
//   >
//     <span className="me-2">{icon}</span>
//     {text}
//   </Link>
// );

// const MobileNavLink = ({ to, text, icon, textClass, onClick }) => (
//   <Link 
//     className={`nav-link ${textClass} py-2 px-3 rounded d-flex align-items-center mb-2`}
//     to={to}
//     onClick={onClick}
//     style={{ background: "rgba(255,255,255,0.1)" }}
//   >
//     <span className="me-3">{icon}</span>
//     {text}
//   </Link>
// );

// const MobileDropdownItem = ({ icon, text, onClick, textClass }) => (
//   <button
//     className={`dropdown-item d-flex align-items-center py-2 px-3 w-100 ${textClass}`}
//     onClick={onClick}
//   >
//     <span className="me-3">{icon}</span>
//     {text}
//   </button>
// );

// const ThemeToggle = ({ darkMode, toggleDarkMode, btnOutlineClass, fullWidth }) => (
//   <button 
//     className={`btn ${btnOutlineClass} ${fullWidth ? "w-100" : ""}`}
//     onClick={toggleDarkMode}
//   >
//     {darkMode ? (
//       <>
//         <FaSun className="me-2" /> Light Mode
//       </>
//     ) : (
//       <>
//         <FaMoon className="me-2" /> Dark Mode
//       </>
//     )}
//   </button>
// );

// const AuthSection = ({ 
//   user, 
//   textClass, 
//   btnOutlineClass, 
//   handleLogout, 
//   dropdownBgClass, 
//   dropdownRef, 
//   dropdown, 
//   setDropdown, 
//   handleNavigation 
// }) => (
//   <>
//     {!user ? (
//       <>
//         <Link className={`btn ${btnOutlineClass} me-2`} to="/login">
//           Login
//         </Link>
//         <Link className="btn btn-primary" to="/signup">
//           Sign Up
//         </Link>
//       </>
//     ) : (
//       <>
//         <button
//           className={`btn ${btnOutlineClass} me-3`}
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//         <div className="position-relative" ref={dropdownRef}>
//           <FaUserCircle
//             size={32}
//             className={`${textClass} hover-scale`}
//             style={{ cursor: "pointer" }}
//             onClick={() => setDropdown((prev) => !prev)}
//           />
//           {dropdown && (
//             <div
//               className={`position-absolute end-0 mt-2 py-2 border rounded shadow ${dropdownBgClass}`}
//               style={{ minWidth: 200, zIndex: 1000 }}
//             >
//               <button
//                 className="dropdown-item d-flex align-items-center px-3 py-2"
//                 onClick={() => handleNavigation("/profile")}
//               >
//                 <FaUserCog className="me-3" /> Profile
//               </button>
//               <button
//                 className="dropdown-item d-flex align-items-center px-3 py-2"
//                 onClick={() => handleNavigation("/orders")}
//               >
//                 <FaShoppingBag className="me-3" /> My Orders
//               </button>
//             </div>
//           )}
//         </div>
//       </>
//     )}
//   </>
// );

// export default Navbar;

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUserCircle, 
  FaSun, 
  FaMoon, 
  FaHome, 
  FaInfoCircle, 
  FaEnvelope,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaUserCog
} from "react-icons/fa";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef(null);

  // Apply dark mode and handle clicks outside
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
      
      // Close mobile menu if clicked outside navbar or menu
      if (mobileMenuOpen && 
          !navbarRef.current?.contains(event.target) && 
          !mobileMenuRef.current?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [darkMode, mobileMenuOpen]);

  // Check auth status on location change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");
    const storedRestaurant = localStorage.getItem("restaurant");
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setAdmin(storedAdmin ? JSON.parse(storedAdmin) : null);
    setRestaurant(storedRestaurant ? JSON.parse(storedRestaurant) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("restaurant");
    setUser(null);
    setAdmin(null);
    setRestaurant(null);
    setDropdown(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Style classes based on dark mode
  const navbarClass = darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light";
  const textClass = darkMode ? "text-white" : "text-dark";
  const btnOutlineClass = darkMode ? "btn-outline-light" : "btn-outline-dark";
  const dropdownBgClass = darkMode ? "bg-dark" : "bg-light";
  const mobileMenuClass = darkMode ? "bg-dark" : "bg-light";

  // Admin/Restaurant view
  if (admin || restaurant) {
    return (
      <nav className={`navbar fixed-top ${navbarClass} shadow-sm`} ref={navbarRef}>
        <div className="container-fluid">
          <Link className={`navbar-brand fw-bold ${textClass}`} to="/">
            <span className="text-primary">Food</span>Delivery
          </Link>
          
          <div className="d-flex align-items-center">
            <button className={`btn ${btnOutlineClass} me-3`} onClick={toggleDarkMode}>
              {darkMode ? <FaSun className="fs-5" /> : <FaMoon className="fs-5" />}
            </button>
            <button className={`btn ${btnOutlineClass}`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Main Navbar
  return (
    <>
      <nav className={`navbar fixed-top ${navbarClass} shadow-sm`} ref={navbarRef}>
        <div className="container-fluid">
          <Link className={`navbar-brand fw-bold ${textClass}`} to="/">
            <span className="text-primary">Food</span>Delivery
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className={`navbar-toggler ${textClass} border-0`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="collapse navbar-collapse">
            <div className="navbar-nav me-auto">
              <NavLink to="/" text="Home" icon={<FaHome />} textClass={textClass} />
              <NavLink to="/about" text="About" icon={<FaInfoCircle />} textClass={textClass} />
              <NavLink to="/contact" text="Contact" icon={<FaEnvelope />} textClass={textClass} />
            </div>

            <div className="d-flex align-items-center ms-4">
              <ThemeToggle 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
                btnOutlineClass={btnOutlineClass} 
              />
              <AuthSection 
                user={user} 
                textClass={textClass} 
                btnOutlineClass={btnOutlineClass} 
                handleLogout={handleLogout} 
                dropdownBgClass={dropdownBgClass} 
                dropdownRef={dropdownRef} 
                dropdown={dropdown} 
                setDropdown={setDropdown} 
                handleNavigation={(path) => {
                  setDropdown(false);
                  navigate(path);
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - uses Bootstrap offcanvas pattern */}
      <div 
        className={`offcanvas offcanvas-start ${mobileMenuClass} ${mobileMenuOpen ? 'show' : ''}`} 
        tabIndex="-1"
        ref={mobileMenuRef}
        style={{ 
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          width: '75%'
        }}
      >
        <div className="offcanvas-body d-flex flex-column">
          <MobileNavLink 
            to="/" 
            text="Home" 
            icon={<FaHome />} 
            textClass={textClass} 
            onClick={toggleMobileMenu} 
          />
          <MobileNavLink 
            to="/about" 
            text="About Us" 
            icon={<FaInfoCircle />} 
            textClass={textClass} 
            onClick={toggleMobileMenu} 
          />
          <MobileNavLink 
            to="/contact" 
            text="Contact" 
            icon={<FaEnvelope />} 
            textClass={textClass} 
            onClick={toggleMobileMenu} 
          />

          <div className="mt-auto pt-3 border-top">
            <ThemeToggle 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
              btnOutlineClass={btnOutlineClass} 
              fullWidth 
            />

            {!user ? (
              <div className="d-flex flex-column gap-2 mt-3">
                <Link 
                  className={`btn ${btnOutlineClass}`} 
                  to="/login"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  className="btn btn-primary" 
                  to="/signup"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mt-3">
                <button
                  className={`btn ${btnOutlineClass} w-100 mb-2`}
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <MobileDropdownItem 
                  icon={<FaUserCog />}
                  text="Profile"
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/profile");
                  }}
                  textClass={textClass}
                />
                <MobileDropdownItem 
                  icon={<FaShoppingBag />}
                  text="My Orders"
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/orders");
                  }}
                  textClass={textClass}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop when mobile menu is open */}
      {mobileMenuOpen && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={toggleMobileMenu}
          style={{ zIndex: 1040 }}
        />
      )}

      {/* Add padding to body to account for fixed navbar */}
      <style>{`
        body {
          padding-top: 56px;
        }
        @media (min-width: 992px) {
          body {
            padding-top: 72px;
          }
        }
      `}</style>
    </>
  );
};

// Reusable components
const NavLink = ({ to, text, icon, textClass }) => (
  <Link 
    className={`nav-link ${textClass} mx-2 d-flex align-items-center`} 
    to={to}
  >
    <span className="me-2">{icon}</span>
    {text}
  </Link>
);

const MobileNavLink = ({ to, text, icon, textClass, onClick }) => (
  <Link 
    className={`nav-link ${textClass} py-2 px-3 rounded d-flex align-items-center mb-2`}
    to={to}
    onClick={onClick}
    style={{ background: "rgba(255,255,255,0.1)" }}
  >
    <span className="me-3">{icon}</span>
    {text}
  </Link>
);

const MobileDropdownItem = ({ icon, text, onClick, textClass }) => (
  <button
    className={`dropdown-item d-flex align-items-center py-2 px-3 w-100 ${textClass}`}
    onClick={onClick}
  >
    <span className="me-3">{icon}</span>
    {text}
  </button>
);

const ThemeToggle = ({ darkMode, toggleDarkMode, btnOutlineClass, fullWidth }) => (
  <button 
    className={`btn ${btnOutlineClass} ${fullWidth ? "w-100" : ""}`}
    onClick={toggleDarkMode}
  >
    {darkMode ? (
      <>
        <FaSun className="me-2" /> Light Mode
      </>
    ) : (
      <>
        <FaMoon className="me-2" /> Dark Mode
      </>
    )}
  </button>
);

const AuthSection = ({ 
  user, 
  textClass, 
  btnOutlineClass, 
  handleLogout, 
  dropdownBgClass, 
  dropdownRef, 
  dropdown, 
  setDropdown, 
  handleNavigation 
}) => (
  <>
    {!user ? (
      <>
        <Link className={`btn ${btnOutlineClass} me-2`} to="/login">
          Login
        </Link>
        <Link className="btn btn-primary" to="/signup">
          Sign Up
        </Link>
      </>
    ) : (
      <>
        <button
          className={`btn ${btnOutlineClass} me-3`}
          onClick={handleLogout}
        >
          Logout
        </button>
        <div className="position-relative" ref={dropdownRef}>
          <FaUserCircle
            size={32}
            className={`${textClass} hover-scale`}
            style={{ cursor: "pointer" }}
            onClick={() => setDropdown((prev) => !prev)}
          />
          {dropdown && (
            <div
              className={`position-absolute end-0 mt-2 py-2 border rounded shadow ${dropdownBgClass}`}
              style={{ minWidth: 200, zIndex: 1000 }}
            >
              <button
                className="dropdown-item d-flex align-items-center px-3 py-2"
                onClick={() => handleNavigation("/profile")}
              >
                <FaUserCog className="me-3" /> Profile
              </button>
              <button
                className="dropdown-item d-flex align-items-center px-3 py-2"
                onClick={() => handleNavigation("/orders")}
              >
                <FaShoppingBag className="me-3" /> My Orders
              </button>
            </div>
          )}
        </div>
      </>
    )}
  </>
);

export default Navbar;