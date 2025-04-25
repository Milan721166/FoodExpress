import React, { useState, useEffect } from 'react';
import '../css/OrderPage.css';

function OrderPage() {
    const mockUserId = "64f1a2b3c4d5e6f7g8h9i0j1"; // Ensure this is a valid MongoDB ObjectId
    const [formData, setFormData] = useState({
        user: mockUserId, // Automatically set user ID
        product: '',
        quantity: 1,
        totalAmount: 0,
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            user: mockUserId, // Ensure user ID is always set
        }));
    }, [mockUserId]);

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