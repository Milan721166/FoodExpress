// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../context/UserContext"; // Import UserContext
// import "../css/UserLogin.css"; // Import custom CSS

// function UserLogin({ theme, toggleTheme }) {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false); // State for success message
//   const { setUser } = useContext(UserContext); // Access setUser from UserContext

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       // Call the backend API for login
//       const response = await fetch("http://localhost:8081/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", ); // Save token to localStorage
//         setUser({ userName: data.user.userName, email: data.user.email }); // Update user context
//         setSuccess(true); // Show success message
//         setError(""); // Clear any previous error




//         // Hide the success message after 3 seconds and redirect
//         setTimeout(() => {
//           setSuccess(false);
//           navigate("/"); // Redirect to home page
//         }, 3000);
//       } else {
//         setError(data.message || "Invalid email or password.");
//       }
//     } catch (err) {
//       console.error("Error during login:", err.message); // Log error message
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className={`user-login-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
//       <div className="user-login-card">
//         <h2 className="user-login-title">User Login</h2>
//         {error && <div className="user-login-error animate-fade-in">{error}</div>}
//         {success && (
//           <div className="user-login-success animate-fade-in">
//             Login successful! Redirecting...
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="user-login-form">
//           <div className="form-group animate-slide-in">
//             <label htmlFor="email" className="form-label">
//               Email
//             </label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group animate-slide-in">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               type="password"
//               className="form-control"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="user-login-button animate-fade-in">
//             Login
//           </button>
//         </form>
//         <p className="user-login-register-text animate-fade-in">
//           Don't have an account?{" "}
//           <a href="/user-register" className="register-link">
//             Register here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default UserLogin;






// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../../context/UserContext"; // Import UserContext
// import { useAuth } from "../../context/AuthContext"; // 👈 Add this line

// import "../css/UserLogin.css"; // Import custom CSS

// function UserLogin({ theme, toggleTheme }) {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const { setUser } = useContext(UserContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8081/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Save token
//         localStorage.setItem("token", data.token);

//         // Save user data to context (check if user exists)
//         if (data.user) {
//           setUser({
//             userName: data.user.userName,
//             email: data.user.email,
//           });
//         }

//         setSuccess(true);
//         setError("");

//         setTimeout(() => {
//           setSuccess(false);
//           navigate("/"); // Redirect to home
//         }, 3000);
//       } else {
//         setError(data.message || "Invalid email or password.");
//       }
//     } catch (err) {
//       console.error("Error during login:", err.message);
//       setError("An error occurred. Please try again.");
//     }
//   };


//   // Inside component:
//   const { login } = useAuth(); // 👈 Add this line with setUser

//   // After setting token and user:
//   if (data.user) {
//     setUser({
//       userName: data.user.userName,
//       email: data.user.email,
//     });
//   }
//   login(); // 👈 Add this line to set isAuthenticated true

//   return (
//     <div className={`user-login-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
//       <div className="user-login-card">
//         <h2 className="user-login-title">User Login</h2>
//         {error && <div className="user-login-error animate-fade-in">{error}</div>}
//         {success && (
//           <div className="user-login-success animate-fade-in">
//             Login successful! Redirecting...
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="user-login-form">
//           <div className="form-group animate-slide-in">
//             <label htmlFor="email" className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group animate-slide-in">
//             <label htmlFor="password" className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="user-login-button animate-fade-in">
//             Login
//           </button>
//         </form>
//         <p className="user-login-register-text animate-fade-in">
//           Don't have an account?{" "}
//           <a href="/user-register" className="register-link">
//             Register here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default UserLogin;







import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Auth context
import { UserContext } from "../../context/UserContext"; // ✅ User context

import "../css/UserLogin.css";

function UserLogin({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { setUser } = useContext(UserContext);
  const { login } = useAuth(); // ✅ Access auth login function

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // ✅ Update user context
        if (data.user) {
          setUser({
            userName: data.user.userName,
            email: data.user.email,
          });
        }

        login(); // ✅ Mark user as authenticated
        setSuccess(true);
        setError("");

        setTimeout(() => {
          navigate("/"); // ✅ Redirect to homepage
        }, 1500);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`user-login-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="user-login-card">
        <h2 className="user-login-title">User Login</h2>

        {error && <div className="user-login-error animate-fade-in">{error}</div>}
        {success && (
          <div className="user-login-success animate-fade-in">
            Login successful! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-login-form">
          <div className="form-group animate-slide-in">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group animate-slide-in">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="user-login-button animate-fade-in">
            Login
          </button>
        </form>

        <p className="user-login-register-text animate-fade-in">
          Don't have an account?{" "}
          <a href="/user-register" className="register-link">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
