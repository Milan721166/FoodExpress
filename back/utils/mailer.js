// const nodemailer=require("nodemailer");
// const transporter=nodemailer.createTransport({
//     service:'gmail',
//     auth: {
//         user: 'your_email@gmail.com',        // ✅ your Gmail
//         pass: 'your_app_password',           // ✅ Gmail App Password (not your Gmail password!)
//     },
// });

// const sendOrderEmail=async (orderData) =>{
//     const {user,items,totalAmount}=orderData;
//     const itemDetails=items.map(
//         (item)=>`Product Id : ${item.product},Quantity : ${item.quantity}`
//     ).join("\n");
// }




// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const sendOrderEmail = async (orderData) => {
//     const { user, items, totalAmount } = orderData;

//     const itemDetails = items.map(
//         (item) => `Product ID: ${item.product}, Quantity: ${item.quantity}`
//     ).join("\n");

//     const mailOptions = {
//         from: '{}',
//         to: 'maitymalay27747@gmail.com',
//         subject: 'New Order Received!',
//         text: `You have received a new order:\n
// User Email: ${user.email}\n
// Items:\n${itemDetails}\n
// Total Amount: ₹${totalAmount}`
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendOrderEmail;




// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, // Your Gmail (used to send the mail)
//         pass: process.env.EMAIL_PASS, // Gmail App Password
//     },
// });

// const sendOrderEmail = async (orderData) => {
//     const { user, items, totalAmount } = orderData;

//     const itemDetails = items.map(
//         (item) => `Product ID: ${item.product}, Quantity: ${item.quantity}`
//     ).join("\n");

//     const mailOptions = {
//         from: user.email, // ✅ Sender: user who placed the order
//         to: 'maitymalay334@gmail.com', // ✅ Your email to receive the order
//         subject: 'New Order Received!',
//         text: `You have received a new order:\n
// User Email: ${user.email}\n
// Items:\n${itemDetails}\n
// Total Amount: ₹${totalAmount}`
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendOrderEmail;




// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// const sendOrderEmail = async (orderData) => {
//     const { user, items, totalAmount } = orderData;

//     const itemDetails = items.map(
//         (item) => `Product: ${item.product?.name || 'Unknown'}, Quantity: ${item.quantity}`
//     ).join("\n");

//     const mailOptions = {
//         from: user.email,
//         to: 'maitymalay334@gmail.com',
//         subject: 'New Order Received!',
//         text: `You have received a new order:\n
// User Email: ${user.email}\n
// Items:\n${itemDetails}\n
// Total Amount: ₹${totalAmount}`
//     };

//     await transporter.sendMail(mailOptions);
// };

// module.exports = sendOrderEmail;




const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOrderEmail = async (orderData) => {
    const { user, items, totalAmount } = orderData;

    const itemDetails = items.map(item => {
        const productName = item.product?.name || 'Unknown';
        return `Product: ${productName}, Quantity: ${item.quantity}`;
    }).join("\n");


    const mailOptions = {
        from: user.email,
        to: 'maitymalay334@gmail.com',
        subject: 'New Order Received!',
        text: `You have received a new order:\n
User Email: ${user.email}\n
Items:\n${itemDetails}\n
Total Amount: ₹${totalAmount}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOrderEmail;

