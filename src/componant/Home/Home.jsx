// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// //import dishes from '../../services/api.json'; // Import the JSON data
// import '../css/Home.css'; // Import custom CSS

// dishes = "http://localhost:8081/api/products";

// function Home({ handleAddToCart, theme, toggleTheme }) {
//   const navigate = useNavigate();

//   const handleProductClick = (id) => {
//     console.log("Navigating to productDetails with id:", id); // Debug log
//     navigate(`/productDetails/${id}`); // Ensure this matches the route in App.jsx
//   };

//   return (
//     <div className={`menu-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
//       <h1 className="menu-title">Trending Foods</h1>
//       <div className="card-grid">
//         {dishes.map((dish) => {
//           console.log("Dish object:", dish); // Debug log
//           return (
//             <div key={dish.id} className="card" onClick={() => handleProductClick(dish.id)}>
//               <img
//                 src={dish.imageUrl}
//                 alt={dish.name}
//                 className="card-image"
//               />
//               <div className="card-content">
//                 <h3 className="card-title">{dish.name}</h3>
//                 <p className="card-description">{dish.description}</p>
//                 <p className="card-price">${dish.price.toFixed(2)}</p>
//                 <div className="card-buttons">
//                   <button className="success" onClick={(e) => { e.stopPropagation(); handleAddToCart(dish); }}>
//                     Add to Cart
//                   </button>
//                   <button className="card-button" onClick={(e) => { e.stopPropagation(); handleProductClick(dish.id); }}>
//                     Order Now
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Home;





import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Import custom CSS

function Home({ handleAddToCart, theme, toggleTheme }) {
  const [dishes, setDishes] = useState([]); // State to store fetched products
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  // Fetch data from the backend API
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/products'); // Backend API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON response
        setDishes(data); // Set the fetched data to state
        setLoading(false); // Set loading to false
      } catch (err) {
        console.error('Error fetching dishes:', err);
        setError(err.message); // Set error message
        setLoading(false); // Set loading to false
      }
    };

    fetchDishes(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once

  const handleProductClick = (id) => {
    console.log('Navigating to productDetails with id:', id); // Debug log
    navigate(`/productDetails/${id}`); // Ensure this matches the route in App.jsx
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div className={`menu-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <h1 className="menu-title">Trending Foods</h1>
      <div className="card-grid">
        {dishes.map((dish) => {
          console.log('Dish object:', dish); // Debug log
          return (
            <div key={dish._id} className="card" onClick={() => handleProductClick(dish._id)}>
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="card-image"
              />
              <div className="card-content">
                <h3 className="card-title">{dish.name}</h3>
                <p className="card-description">{dish.description}</p>
                <p className="card-price">${dish.price.toFixed(2)}</p>
                <div className="card-buttons">
                  <button
                    className="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(dish);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="card-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(dish._id);
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;