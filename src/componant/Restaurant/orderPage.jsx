// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '../css/OrderPage.css';

// function OrderPage() {
//     const { id } = useParams();
//     const [product, setProduct] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' });

//     useEffect(() => {
//         const fetchProduct = async () => {
//             const res = await fetch(`http://localhost:8081/api/products/${id}`);
//             const data = await res.json();
//             setProduct(data);
//         };
//         fetchProduct();
//     }, [id]);

//     const handleChange = (e) => {
//         setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
//     };

//     // const handleSubmitOrder = async (e) => {
//     //     e.preventDefault();

//     //     const orderData = {
//     //         user: {
//     //             name: customerInfo.name,
//     //             email: customerInfo.email,
//     //             address: customerInfo.address,
//     //         },
//     //         items: [
//     //             {
//     //                 product: id,
//     //                 quantity,
//     //             }
//     //         ],
//     //         totalAmount: product.price * quantity,
//     //     };

//     //     const response = await fetch('http://localhost:8081/api/orders/create', {
//     //         method: 'POST',
//     //         headers: { 'Content-Type': 'application/json' },
//     //         body: JSON.stringify(orderData),
//     //     });

//     //     if (response.ok) {
//     //         alert('Order placed successfully! The restaurant will be notified via email.');
//     //     } else {
//     //         alert('Error placing order. Please try again.');
//     //     }
//     // };





//     const handleSubmitOrder = async (e) => {
//         e.preventDefault();

//         const totalAmount = product.price * quantity;

//         const orderData = {
//             user: customerInfo,
//             items: [
//                 {
//                     product: id,
//                     quantity,
//                 },
//             ],
//             totalAmount,
//         };

//         try {
//             const response = await fetch('http://localhost:8081/api/orders/create', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderData),
//             });

//             if (response.ok) {
//                 alert('Order placed successfully! The restaurant will be notified via email.');
//             } else {
//                 const errorData = await response.json();
//                 console.error('Error placing order:', errorData);
//                 alert(`Error placing order: ${errorData.message}`);
//             }
//         } catch (err) {
//             console.error('Network error:', err);
//             alert('Network error. Please try again later.');
//         }
//     };


//     if (!product) return <p>Loading...</p>;

//     return (
//         <div className="order-page-container">
//             <h2>Order: {product.name}</h2>
//             <p>Price: ${product.price}</p>

//             <form onSubmit={handleSubmitOrder}>


//                 <label>
//                     Email:
//                     <input type="email" name="email" value={customerInfo.email} onChange={handleChange} required />
//                 </label>

//                 <label>
//                     Address:
//                     <textarea name="address" value={customerInfo.address} onChange={handleChange} required />
//                 </label>

//                 <label>
//                     Quantity:
//                     <input
//                         type="number"
//                         min="1"
//                         value={quantity}
//                         onChange={(e) => setQuantity(parseInt(e.target.value))}
//                     />
//                 </label>

//                 <button type="submit">Place Order</button>
//             </form>
//         </div>
//     );
// }

// export default OrderPage;





import React, { useState } from 'react';
import '../css/OrderPage.css';

function OrderPage() {
    const [formData, setFormData] = useState({
        user: '',
        product: '',
        quantity: 1,
        totalAmount: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'quantity' || name === 'totalAmount' ? Number(value) : value,
        });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        const orderData = {
            user: formData.user,
            items: [
                {
                    product: formData.product,
                    quantity: formData.quantity,
                }
            ],
            totalAmount: formData.totalAmount,
        };

        try {
            const response = await fetch('http://localhost:8081/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                alert('Order placed successfully! The restaurant will be notified via email.');
            } else {
                const errorData = await response.json();
                console.error('Error placing order:', errorData);
                alert(`Error placing order: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Network error:', err);
            alert('Network error. Please try again later.');
        }
    };

    return (
        <div className="order-page-container">
            <h2>Manual Order Form</h2>
            <form onSubmit={handleSubmitOrder}>
                <label>
                    User ID:
                    <input
                        type="text"
                        name="user"
                        value={formData.user}
                        onChange={handleChange}
                        placeholder="MongoDB User ObjectId"
                        required
                    />
                </label>

                <label>
                    Product ID:
                    <input
                        type="text"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        placeholder="MongoDB Product ObjectId"
                        required
                    />
                </label>

                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Total Amount ($):
                    <input
                        type="number"
                        name="totalAmount"
                        min="1"
                        value={formData.totalAmount}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}

export default OrderPage;
