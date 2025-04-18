// import React, { useState, useEffect } from 'react';
// import '../css/RestaurantPage.css';

// function RestaurantPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [isOnline, setIsOnline] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [newItem, setNewItem] = useState({ name: '', price: '', image: '' });
//   const [editItem, setEditItem] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [orderFilter, setOrderFilter] = useState('all');
//   const [restaurantName, setRestaurantName] = useState('My Restaurant');
//   const [restaurantLogo, setRestaurantLogo] = useState('https://via.placeholder.com/150');
//   const [notifications, setNotifications] = useState([]);

//   // Fetch restaurant data from backend (simulated)
//   useEffect(() => {
//     // Simulate fetching restaurant data
//     setTimeout(() => {
//       setRestaurantName('FoodieExpress');
//       setRestaurantLogo('https://via.placeholder.com/150');
//     }, 1000);
//   }, []);

//   // Add a new item to the menu
//   // const addItem = () => {
//   //   if (newItem.name && newItem.price) {
//   //     setMenuItems([...menuItems, { id: Date.now(), ...newItem }]);
//   //     setNewItem({ name: '', price: '', image: '' });
//   //   } else {
//   //     alert('Please fill in both name and price.');
//   //   }
//   // };

//   // Delete an item from the menu
//   const deleteItem = (id) => {
//     setMenuItems(menuItems.filter((item) => item.id !== id));
//   };

//   // Edit an item in the menu
//   const editMenuItem = (item) => {
//     setEditItem(item);
//     setNewItem({ name: item.name, price: item.price, image: item.image });
//   };

//   // Save edited item
//   const saveEditedItem = () => {
//     if (editItem) {
//       setMenuItems(
//         menuItems.map((item) =>
//           item.id === editItem.id ? { ...item, ...newItem } : item
//         )
//       );
//       setEditItem(null);
//       setNewItem({ name: '', price: '', image: '' });
//     }
//   };

//   // Toggle online/offline status
//   const toggleOnlineStatus = () => {
//     setIsOnline(!isOnline);
//     alert(`You are now ${isOnline ? 'offline' : 'online'}.`);
//   };

//   // Accept an order
//   const acceptOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Accepted' } : order
//       )
//     );
//     alert(`Order ${orderId} accepted.`);
//   };

//   // Cancel an order
//   const cancelOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Cancelled' } : order
//       )
//     );
//     alert(`Order ${orderId} cancelled.`);
//   };

//   // Simulate calling a customer
//   const callCustomer = (phone) => {
//     alert(`Calling customer at ${phone}...`);
//   };

//   // Simulate calling an admin
//   const callAdmin = () => {
//     alert('Calling admin...');
//   };

//   // Filter orders by status
//   const filteredOrders = orders.filter((order) => {
//     if (orderFilter === 'all') return true;
//     return order.status === orderFilter;
//   });

//   // Export orders to CSV
//   const exportOrders = () => {
//     const csvContent =
//       'data:text/csv;charset=utf-8,' +
//       'Order ID,Status,Customer Name,Phone,Items,Total Price\n' +
//       orders
//         .map(
//           (order) =>
//             `${order.id},${order.status},${order.customerName},${order.phone},${order.items.join(
//               '; '
//             )},$${order.totalPrice}`
//         )
//         .join('\n');
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'orders.csv');
//     document.body.appendChild(link);
//     link.click();
//   };

//   // Simulate a new order notification
//   const simulateNewOrder = () => {
//     const newOrder = {
//       id: Date.now(),
//       customerName: 'John Doe',
//       phone: '+1234567890',
//       items: ['Burger', 'Fries'],
//       totalPrice: 15.99,
//       status: 'Pending',
//     };
//     setOrders([...orders, newOrder]);
//     setNotifications([...notifications, `New order received: Order #${newOrder.id}`]);
//   };


//   const AddProductForm = ({ restaurantId }) => {
//     const [newItem, setNewItem] = useState({
//       name: '',
//       price: '',
//       image: '',
//       description: '',
//     });

//     const [editItem, setEditItem] = useState(null);

//     const addItem = async () => {
//       // if (!restaurantId) {
//       //   alert('Restaurant ID is missing');
//       //   return;
//       // }

//       try {
//         const response = await axios.post('localhost:8081//api/products', {
//           name: newItem.name,
//           price: newItem.price,
//           imageUrl: newItem.image,
//           description: newItem.description,

//         }, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           }
//         });

//         console.log('Product added:', response.data);
//         // reset form
//         setNewItem({ name: '', price: '', image: '', description: '' });
//       } catch (err) {
//         console.error('Failed to add product', err);
//         alert(err.response?.data?.message || 'Error adding product');
//       }
//     };

//     return (
//       <div className="restaurant-page">
//         {/* Restaurant Header */}
//         <div className="restaurant-header">
//           <img src={restaurantLogo} alt="Restaurant Logo" className="restaurant-logo" />
//           <h1>{restaurantName}</h1>
//         </div>

//         {/* Online/Offline Toggle */}
//         <div className="online-status">
//           <button onClick={toggleOnlineStatus} className={isOnline ? 'online' : 'offline'}>
//             {isOnline ? 'Go Offline' : 'Go Online'}
//           </button>
//         </div>

//         {/* Add/Edit Item Form */}
//         <div className="add-item-form">
//           <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
//           <input
//             type="text"
//             placeholder="Item Name"
//             value={newItem.name}
//             onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//           />
//           <input
//             type="number"
//             placeholder="Item Price"
//             value={newItem.price}
//             onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Image URL"
//             value={newItem.image}
//             onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
//           />
//           <textarea
//             placeholder="Description"
//             value={newItem.description}
//             onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//           />
//           {editItem ? (
//             <>
//               <button onClick={saveEditedItem}>Save Changes</button>
//               <button onClick={() => setEditItem(null)}>Cancel</button>
//             </>
//           ) : (
//             <button onClick={addItem}>Add Item</button>
//           )}
//         </div>

//         {/* Search Menu Items */}
//         <div className="search-menu">
//           <input
//             type="text"
//             placeholder="Search menu items..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Menu List */}
//         <div className="menu-list">
//           <h2>Menu Items</h2>
//           {menuItems.length === 0 ? (
//             <p>No items in the menu.</p>
//           ) : (
//             <ul>
//               {menuItems
//                 .filter((item) =>
//                   item.name.toLowerCase().includes(searchQuery.toLowerCase())
//                 )
//                 .map((item) => (
//                   <li key={item.id}>
//                     <img src={item.image || 'https://www.logodesign.net/logo/smoking-burger-with-lettuce-3624ld.png'} alt={item.name} className="menu-item-image" />
//                     <span>{item.name} - ${item.price}</span>
//                     <div>
//                       <button onClick={() => editMenuItem(item)}>Edit</button>
//                       <button onClick={() => deleteItem(item.id)}>Delete</button>
//                     </div>
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </div>

//         {/* Orders List */}
//         <div className="orders-list">
//           <h2>Orders</h2>
//           <div className="order-filters">
//             <button onClick={() => setOrderFilter('all')}>All</button>
//             <button onClick={() => setOrderFilter('Pending')}>Pending</button>
//             <button onClick={() => setOrderFilter('Accepted')}>Accepted</button>
//             <button onClick={() => setOrderFilter('Cancelled')}>Cancelled</button>
//           </div>
//           {filteredOrders.length === 0 ? (
//             <p>No orders yet.</p>
//           ) : (
//             <ul>
//               {filteredOrders.map((order) => (
//                 <li key={order.id}>
//                   <div>
//                     <strong>Order ID:</strong> {order.id}
//                   </div>
//                   <div>
//                     <strong>Status:</strong> {order.status}
//                   </div>
//                   <div>
//                     <strong>Customer:</strong> {order.customerName} ({order.phone})
//                   </div>
//                   <div>
//                     <strong>Items:</strong> {order.items.join(', ')}
//                   </div>
//                   <div>
//                     <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
//                   </div>
//                   <div className="order-actions">
//                     <button onClick={() => acceptOrder(order.id)}>Accept</button>
//                     <button onClick={() => cancelOrder(order.id)}>Cancel</button>
//                     <button onClick={() => callCustomer(order.phone)}>Call Customer</button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Notifications */}
//         <div className="notifications">
//           <h2>Notifications</h2>
//           {notifications.length === 0 ? (
//             <p>No new notifications.</p>
//           ) : (
//             <ul>
//               {notifications.map((notification, index) => (
//                 <li key={index}>{notification}</li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Call Admin Button */}
//         <div className="call-admin">
//           <button onClick={callAdmin}>Call Admin</button>
//         </div>

//         {/* Export Orders Button */}
//         <div className="export-orders">
//           <button onClick={exportOrders}>Export Orders to CSV</button>
//         </div>

//         {/* Simulate New Order Button */}
//         <div className="simulate-order">
//           <button onClick={simulateNewOrder}>Simulate New Order</button>
//         </div>
//       </div>
//     );
//   }
// }

// export default RestaurantPage;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../css/RestaurantPage.css';

// function RestaurantPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [isOnline, setIsOnline] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [newItem, setNewItem] = useState({ name: '', price: '', image: '', description: '' });
//   const [editItem, setEditItem] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [orderFilter, setOrderFilter] = useState('all');
//   const [restaurantName, setRestaurantName] = useState('My Restaurant');
//   const [restaurantLogo, setRestaurantLogo] = useState('https://via.placeholder.com/150');
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     setTimeout(() => {
//       setRestaurantName('FoodieExpress');
//       setRestaurantLogo('https://via.placeholder.com/150');
//     }, 1000);
//   }, []);

//   const addItem = async () => {
//     const { name, price, image, description } = newItem;

//     if (!name || !price || !image || !description) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8081/api/products', {
//         name,
//         price,
//         imageUrl: image,
//         description,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         }
//       });

//       // const response = await axios.post('http://localhost:8081/api/products', {
//       //   name,
//       //   price,
//       //   image, // <-- updated this line
//       //   description,
//       // }, {
//       //   headers: {
//       //     Authorization: `Bearer ${localStorage.getItem('token')}`,
//       //   }
//       // });

//       console.log('Product added:', response.data);
//       setMenuItems([...menuItems, { ...response.data, id: response.data._id }]);
//       setNewItem({ name: '', price: '', image: '', description: '' });
//     } catch (err) {
//       console.error('Failed to add product', err);
//       alert(err.response?.data?.message || 'Error adding product');
//     }
//   };

//   const deleteItem = (id) => {
//     setMenuItems(menuItems.filter((item) => item.id !== id));
//   };

//   const editMenuItem = (item) => {
//     setEditItem(item);
//     setNewItem({ name: item.name, price: item.price, image: item.image, description: item.description });
//   };

//   const saveEditedItem = () => {
//     if (editItem) {
//       setMenuItems(
//         menuItems.map((item) =>
//           item.id === editItem.id ? { ...item, ...newItem } : item
//         )
//       );
//       setEditItem(null);
//       setNewItem({ name: '', price: '', image: '', description: '' });
//     }
//   };

//   const toggleOnlineStatus = () => {
//     setIsOnline(!isOnline);
//     alert(`You are now ${isOnline ? 'offline' : 'online'}.`);
//   };

//   const acceptOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Accepted' } : order
//       )
//     );
//     alert(`Order ${orderId} accepted.`);
//   };

//   const cancelOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Cancelled' } : order
//       )
//     );
//     alert(`Order ${orderId} cancelled.`);
//   };

//   const callCustomer = (phone) => {
//     alert(`Calling customer at ${phone}...`);
//   };

//   const callAdmin = () => {
//     alert('Calling admin...');
//   };

//   const exportOrders = () => {
//     const csvContent =
//       'data:text/csv;charset=utf-8,' +
//       'Order ID,Status,Customer Name,Phone,Items,Total Price\n' +
//       orders
//         .map(
//           (order) =>
//             `${order.id},${order.status},${order.customerName},${order.phone},${order.items.join(
//               '; '
//             )},$${order.totalPrice}`
//         )
//         .join('\n');
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'orders.csv');
//     document.body.appendChild(link);
//     link.click();
//   };

//   // const simulateNewOrder = () => {
//   //   const newOrder = {
//   //     id: Date.now(),
//   //     customerName: 'John Doe',
//   //     phone: '+1234567890',
//   //     items: ['Burger', 'Fries'],
//   //     totalPrice: 15.99,
//   //     status: 'Pending',
//   //   };
//   //   setOrders([...orders, newOrder]);
//   //   setNotifications([...notifications, `New order received: Order #${newOrder.id}`]);
//   // };

//   // const filteredOrders = orders.filter((order) => {
//   //   if (orderFilter === 'all') return true;
//   //   return order.status === orderFilter;
//   // });


//   // useEffect(() => {
//   //   fetchOrders();
//   // }, []);

//   // const fetchOrders = async () => {
//   //   try {
//   //     const response = await axios.get('http://localhost:8081/api/orders/allOrders', {
//   //       // headers: {
//   //       //   Authorization: `Bearer ${localStorage.getItem('token')}`, // include if your route is protected
//   //       // }
//   //     });
//   //     setOrders(response.data);
//   //   } catch (err) {
//   //     console.error('Error fetching orders:', err);
//   //     alert('Failed to fetch orders');
//   //   }
//   // };


//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:8081/api/orders/allOrders', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         setOrders(response.data); // assuming response.data is an array
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//       }
//     };

//     fetchOrders();
//   }, []);


//   return (
//     <div className="restaurant-page">
//       {/* Restaurant Header */}
//       <div className="restaurant-header">
//         <img src={restaurantLogo} alt="Restaurant Logo" className="restaurant-logo" />
//         <h1>{restaurantName}</h1>
//       </div>

//       {/* Online/Offline Toggle */}
//       <div className="online-status">
//         <button onClick={toggleOnlineStatus} className={isOnline ? 'online' : 'offline'}>
//           {isOnline ? 'Go Offline' : 'Go Online'}
//         </button>
//       </div>

//       {/* Add/Edit Item Form */}
//       <div className="add-item-form">
//         <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
//         <input
//           type="text"
//           placeholder="Item Name"
//           value={newItem.name}
//           onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Item Price"
//           value={newItem.price}
//           onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={newItem.image}
//           onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
//         />
//         <textarea
//           placeholder="Description"
//           value={newItem.description}
//           onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//         />
//         {editItem ? (
//           <>
//             <button onClick={saveEditedItem}>Save Changes</button>
//             <button onClick={() => setEditItem(null)}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={addItem}>Add Item</button>
//         )}
//       </div>

//       {/* Search Menu Items */}
//       <div className="search-menu">
//         <input
//           type="text"
//           placeholder="Search menu items..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Menu List */}
//       <div className="menu-list">
//         <h2>Menu Items</h2>
//         {menuItems.length === 0 ? (
//           <p>No items in the menu.</p>
//         ) : (
//           <ul>
//             {menuItems
//               .filter((item) =>
//                 item.name.toLowerCase().includes(searchQuery.toLowerCase())
//               )
//               .map((item) => (
//                 <li key={item.id}>
//                   <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="menu-item-image" />
//                   <span>{item.name} - ${item.price}</span>
//                   <div>
//                     <button onClick={() => editMenuItem(item)}>Edit</button>
//                     <button onClick={() => deleteItem(item.id)}>Delete</button>
//                   </div>
//                 </li>
//               ))}
//           </ul>
//         )}
//       </div>

//       {/* Orders List */}
//       <div className="orders-list">
//         <h2>Orders</h2>
//         <div className="order-filters">
//           <button onClick={() => setOrderFilter('all')}>All</button>
//           <button onClick={() => setOrderFilter('Pending')}>Pending</button>
//           <button onClick={() => setOrderFilter('Accepted')}>Accepted</button>
//           <button onClick={() => setOrderFilter('Cancelled')}>Cancelled</button>
//         </div>
//         {/* {filteredOrders.length === 0 ? (
//           <p>No orders yet.</p>
//         ) : (
//           <ul>
//             {filteredOrders.map((order) => (
//               <li key={order.id}>
//                 <div><strong>Order ID:</strong> {order.id}</div>
//                 <div><strong>Status:</strong> {order.status}</div>
//                 <div><strong>Customer:</strong> {order.customerName} ({order.phone})</div>
//                 <div><strong>Items:</strong> {order.items.join(', ')}</div>
//                 <div><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</div>
//                 <div className="order-actions">
//                   <button onClick={() => acceptOrder(order.id)}>Accept</button>
//                   <button onClick={() => cancelOrder(order.id)}>Cancel</button>
//                   <button onClick={() => callCustomer(order.phone)}>Call Customer</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )} */}



//         {filteredOrders.length === 0 ? (
//           <p>No orders yet.</p>
//         ) : (
//           <ul>
//             {filteredOrders.map((order) => (
//               <li key={order._id || order.id}>
//                 <div><strong>Order ID:</strong> {order._id || order.id}</div>
//                 <div><strong>Status:</strong> {order.status}</div>
//                 <div><strong>Customer:</strong> {order.customerName} ({order.phone})</div>
//                 <div><strong>Items:</strong> {order.items?.join(', ')}</div>
//                 <div><strong>Total Price:</strong> ${order.totalPrice?.toFixed(2)}</div>
//                 <div className="order-actions">
//                   <button onClick={() => acceptOrder(order._id || order.id)}>Accept</button>
//                   <button onClick={() => cancelOrder(order._id || order.id)}>Cancel</button>
//                   <button onClick={() => callCustomer(order.phone)}>Call Customer</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}

//       </div>

//       {/* Notifications */}
//       <div className="notifications">
//         <h2>Notifications</h2>
//         {notifications.length === 0 ? (
//           <p>No new notifications.</p>
//         ) : (
//           <ul>{notifications.map((n, i) => <li key={i}>{n}</li>)}</ul>
//         )}
//       </div>

//       {/* Utility Buttons */}
//       <div className="call-admin">
//         <button onClick={callAdmin}>Call Admin</button>
//       </div>

//       <div className="export-orders">
//         <button onClick={exportOrders}>Export Orders to CSV</button>
//       </div>

//       <div className="simulate-order">
//         <button onClick={simulateNewOrder}>Simulate New Order</button>
//       </div>
//     </div>
//   );
// }

// export default RestaurantPage;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../css/RestaurantPage.css';

// function RestaurantPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [isOnline, setIsOnline] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [newItem, setNewItem] = useState({ name: '', price: '', image: '', description: '' });
//   const [editItem, setEditItem] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [orderFilter, setOrderFilter] = useState('all');
//   const [restaurantName, setRestaurantName] = useState('My Restaurant');
//   const [restaurantLogo, setRestaurantLogo] = useState('https://via.placeholder.com/150');
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     setTimeout(() => {
//       setRestaurantName('FoodieExpress');
//       setRestaurantLogo('https://via.placeholder.com/150');
//     }, 1000);
//   }, []);

//   const addItem = async () => {
//     const { name, price, image, description } = newItem;

//     if (!name || !price || !image || !description) {
//       alert('Please fill in all fields.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8081/api/products', {
//         name,
//         price,
//         imageUrl: image,
//         description,
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         }
//       });

//       console.log('Product added:', response.data);
//       setMenuItems([...menuItems, { ...response.data, id: response.data._id }]);
//       setNewItem({ name: '', price: '', image: '', description: '' });
//     } catch (err) {
//       console.error('Failed to add product', err);
//       alert(err.response?.data?.message || 'Error adding product');
//     }
//   };

//   const deleteItem = (id) => {
//     setMenuItems(menuItems.filter((item) => item.id !== id));
//   };

//   const editMenuItem = (item) => {
//     setEditItem(item);
//     setNewItem({ name: item.name, price: item.price, image: item.image, description: item.description });
//   };

//   const saveEditedItem = () => {
//     if (editItem) {
//       setMenuItems(
//         menuItems.map((item) =>
//           item.id === editItem.id ? { ...item, ...newItem } : item
//         )
//       );
//       setEditItem(null);
//       setNewItem({ name: '', price: '', image: '', description: '' });
//     }
//   };

//   const toggleOnlineStatus = () => {
//     setIsOnline(!isOnline);
//     alert(`You are now ${isOnline ? 'offline' : 'online'}.`);
//   };

//   const acceptOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Accepted' } : order
//       )
//     );
//     alert(`Order ${orderId} accepted.`);
//   };

//   const cancelOrder = (orderId) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId ? { ...order, status: 'Cancelled' } : order
//       )
//     );
//     alert(`Order ${orderId} cancelled.`);
//   };

//   const callCustomer = (phone) => {
//     alert(`Calling customer at ${phone}...`);
//   };

//   const callAdmin = () => {
//     alert('Calling admin...');
//   };

//   const exportOrders = () => {
//     const csvContent =
//       'data:text/csv;charset=utf-8,' +
//       'Order ID,Status,Customer Name,Phone,Items,Total Price\n' +
//       orders
//         .map(
//           (order) =>
//             `${order.id},${order.status},${order.customerName},${order.phone},${order.items.join(
//               '; '
//             )},$${order.totalPrice}`
//         )
//         .join('\n');
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', 'orders.csv');
//     document.body.appendChild(link);
//     link.click();
//   };

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('http://localhost:8081/api/orders/allOrders', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setOrders(response.data); // assuming response.data is an array
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const filteredOrders = orders.filter((order) => {
//     if (orderFilter === 'all') return true;
//     return order.status === orderFilter;
//   });

//   return (
//     <div className="restaurant-page">
//       {/* Restaurant Header */}
//       <div className="restaurant-header">
//         <img src={restaurantLogo} alt="Restaurant Logo" className="restaurant-logo" />
//         <h1>{restaurantName}</h1>
//       </div>

//       {/* Online/Offline Toggle */}
//       <div className="online-status">
//         <button onClick={toggleOnlineStatus} className={isOnline ? 'online' : 'offline'}>
//           {isOnline ? 'Go Offline' : 'Go Online'}
//         </button>
//       </div>

//       {/* Add/Edit Item Form */}
//       <div className="add-item-form">
//         <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
//         <input
//           type="text"
//           placeholder="Item Name"
//           value={newItem.name}
//           onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
//         />
//         <input
//           type="number"
//           placeholder="Item Price"
//           value={newItem.price}
//           onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={newItem.image}
//           onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
//         />
//         <textarea
//           placeholder="Description"
//           value={newItem.description}
//           onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
//         />
//         {editItem ? (
//           <>
//             <button onClick={saveEditedItem}>Save Changes</button>
//             <button onClick={() => setEditItem(null)}>Cancel</button>
//           </>
//         ) : (
//           <button onClick={addItem}>Add Item</button>
//         )}
//       </div>

//       {/* Menu List */}
//       <div className="menu-list">
//         <h2>Menu Items</h2>
//         {menuItems.length === 0 ? (
//           <p>No items in the menu.</p>
//         ) : (
//           <ul>
//             {menuItems
//               .filter((item) =>
//                 item.name.toLowerCase().includes(searchQuery.toLowerCase())
//               )
//               .map((item) => (
//                 <li key={item.id}>
//                   <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="menu-item-image" />
//                   <span>{item.name} - ${item.price}</span>
//                   <div>
//                     <button onClick={() => editMenuItem(item)}>Edit</button>
//                     <button onClick={() => deleteItem(item.id)}>Delete</button>
//                   </div>
//                 </li>
//               ))}
//           </ul>
//         )}
//       </div>

//       {/* Orders List */}
//       <div className="orders-list">
//         <h2>Orders</h2>
//         <div className="order-filters">
//           <button onClick={() => setOrderFilter('all')}>All</button>
//           <button onClick={() => setOrderFilter('Pending')}>Pending</button>
//           <button onClick={() => setOrderFilter('Accepted')}>Accepted</button>
//           <button onClick={() => setOrderFilter('Cancelled')}>Cancelled</button>
//         </div>
//         {filteredOrders.length === 0 ? (
//           <p>No orders yet.</p>
//         ) : (
//           <ul>
//             {filteredOrders.map((order) => (
//               <li key={order._id || order.id}>
//                 <div><strong>Order ID:</strong> {order._id || order.id}</div>
//                 <div><strong>Status:</strong> {order.status}</div>
//                 <div><strong>Customer:</strong> {order.customerName} ({order.phone})</div>
//                 <div><strong>Items:</strong> {order.items?.join(', ')}</div>
//                 <div><strong>Total Price:</strong> ${order.totalPrice?.toFixed(2)}</div>
//                 <div className="order-actions">
//                   <button onClick={() => acceptOrder(order._id || order.id)}>Accept</button>
//                   <button onClick={() => cancelOrder(order._id || order.id)}>Cancel</button>
//                   <button onClick={() => callCustomer(order.phone)}>Call Customer</button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Notifications */}
//       <div className="notifications">
//         <h2>Notifications</h2>
//         {notifications.length === 0 ? (
//           <p>No new notifications.</p>
//         ) : (
//           <ul>{notifications.map((n, i) => <li key={i}>{n}</li>)}</ul>
//         )}
//       </div>

//       {/* Utility Buttons */}
//       <div className="call-admin">
//         <button onClick={callAdmin}>Call Admin</button>
//       </div>

//       <div className="export-orders">
//         <button onClick={exportOrders}>Export Orders to CSV</button>
//       </div>

//       <div className="simulate-order">
//         <button onClick={simulateNewOrder}>Simulate New Order</button>
//       </div>
//     </div>
//   );
// }

// export default RestaurantPage;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/RestaurantPage.css';

function RestaurantPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '', description: '' });
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [restaurantName, setRestaurantName] = useState('My Restaurant');
  const [restaurantLogo, setRestaurantLogo] = useState('https://via.placeholder.com/150');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRestaurantName('FoodieExpress');
      setRestaurantLogo('https://via.placeholder.com/150');
    }, 1000);
  }, []);

  const addItem = async () => {
    const { name, price, image, description } = newItem;

    if (!name || !price || !image || !description) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/products', {
        name,
        price,
        imageUrl: image,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      console.log('Product added:', response.data);
      setMenuItems([...menuItems, { ...response.data, id: response.data._id }]);
      setNewItem({ name: '', price: '', image: '', description: '' });
    } catch (err) {
      console.error('Failed to add product', err);
      alert(err.response?.data?.message || 'Error adding product');
    }
  };

  const deleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const editMenuItem = (item) => {
    setEditItem(item);
    setNewItem({ name: item.name, price: item.price, image: item.image, description: item.description });
  };

  const saveEditedItem = () => {
    if (editItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editItem.id ? { ...item, ...newItem } : item
        )
      );
      setEditItem(null);
      setNewItem({ name: '', price: '', image: '', description: '' });
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    alert(`You are now ${isOnline ? 'offline' : 'online'}.`);
  };

  const acceptOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'Accepted' } : order
      )
    );
    alert(`Order ${orderId} accepted.`);
  };

  const cancelOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      )
    );
    alert(`Order ${orderId} cancelled.`);
  };

  const callCustomer = (phone) => {
    alert(`Calling customer at ${phone}...`);
  };

  const callAdmin = () => {
    alert('Calling admin...');
  };

  const exportOrders = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order ID,Status,Customer Name,Phone,Items,Total Price\n' +
      orders
        .map(
          (order) =>
            `${order.id},${order.status},${order.customerName},${order.phone},${order.items.join(
              '; '
            )},$${order.totalPrice}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/orders/allOrders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data); // assuming response.data is an array
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const simulateNewOrder = () => {
    // Example order data
    const newOrder = {
      id: orders.length + 1,
      status: 'Pending',
      customerName: 'John Doe',
      phone: '123-456-7890',
      items: ['Burger', 'Fries'],
      totalPrice: 20.99,
    };

    setOrders([...orders, newOrder]);
    alert('New order simulated!');
  };

  return (
    <div className="restaurant-page">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <img src={restaurantLogo} alt="Restaurant Logo" className="restaurant-logo" />
        <h1>{restaurantName}</h1>
      </div>

      {/* Online/Offline Toggle */}
      <div className="online-status">
        <button onClick={toggleOnlineStatus} className={isOnline ? 'online' : 'offline'}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* Add/Edit Item Form */}
      <div className="add-item-form">
        <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newItem.image}
          onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        {editItem ? (
          <>
            <button onClick={saveEditedItem}>Save Changes</button>
            <button onClick={() => setEditItem(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={addItem}>Add Item</button>
        )}
      </div>

      {/* Menu List */}
      <div className="menu-list">
        <h2>Menu Items</h2>
        {menuItems.length === 0 ? (
          <p>No items in the menu.</p>
        ) : (
          <ul>
            {menuItems
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <li key={item.id}>
                  <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="menu-item-image" />
                  <span>{item.name} - ${item.price}</span>
                  <div>
                    <button onClick={() => editMenuItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Orders List
      <div className="orders-list">
        <h2>Orders</h2>
        <div className="order-filters">
          <button onClick={() => setOrderFilter('all')}>All</button>
          <button onClick={() => setOrderFilter('Pending')}>Pending</button>
          <button onClick={() => setOrderFilter('Accepted')}>Accepted</button>
          <button onClick={() => setOrderFilter('Cancelled')}>Cancelled</button>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <ul>
            {filteredOrders.map((order) => (
              <li key={order._id || order.id}>
                <div><strong>Order ID:</strong> {order._id || order.id}</div>
                <div><strong>Status:</strong> {order.status}</div>
                <div><strong>Customer:</strong> {order.customerName} ({order.phone})</div>
                <div><strong>Items:</strong> {order.items?.join(', ')}</div>
                <div><strong>Total Price:</strong> ${order.totalPrice?.toFixed(2)}</div>
                <div className="order-actions">
                  <button onClick={() => acceptOrder(order._id || order.id)}>Accept</button>
                  <button onClick={() => cancelOrder(order._id || order.id)}>Cancel</button>
                  <button onClick={() => callCustomer(order.phone)}>Call Customer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}

    </div>
  );
}

export default RestaurantPage;
