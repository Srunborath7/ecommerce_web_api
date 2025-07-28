# 🛒 POS & E-commerce Backend & Frontend (Node.js + React + MySQL)

This project is a Point of Sale (POS) and E-commerce system with full backend and frontend implementation using:

- Node.js (Express)
- MySQL
- React.js
- Bootstrap
- Session-based authentication
- PayPal payment integration

---

## 📦 Technologies Used

**Backend:**
- Node.js
- Express
- MySQL
- express-session
- bcrypt
- multer
- JWT (if used)
- PayPal REST API

**Frontend:**
- React.js
- React Router
- Context API
- Bootstrap

---

## 🛠️ Backend Setup Instructions

### 1. Clone the Repository

```bash
git clone[https://github.com/Srunborath7/ecommerce_web_api](https://github.com/Srunborath7/ecommerce_web_api)
cd yourproject/backend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Create .env File
Inside /backend, create a .env file:

env
Copy
Edit
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommercedb
SESSION_SECRET=your_secret_key
4. Create Database in MySQL
sql
Copy
Edit
CREATE DATABASE ecommercedb;
Then import the SQL file (if provided):

bash
Copy
Edit
mysql -u root -p your_database_name < schema.sql
5. Start the Backend Server
bash
Copy
Edit
npm start
The backend will run on:
http://localhost:5000

🎨 Frontend Setup Instructions
1. Go to Frontend Folder
bash
Copy
Edit
cd ../frontend
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure API Base URL
In a .env file:

env
Copy
Edit
REACT_APP_API_URL=http://localhost:5000/api
4. Start Frontend App
bash
Copy
Edit
npm start
The frontend will run on:
http://localhost:3000

🧪 How to Test (Postman or API Client)
✅ Register
http
Copy
Edit
POST /api/user/register
json
Copy
Edit
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "123456",
  "role_id": 1
}
✅ Login
http
Copy
Edit
POST /api/user/login
json
Copy
Edit
{
  "emailOrUsername": "admin",
  "password": "123456"
}
✅ Place Order
http
Copy
Edit
POST /api/checkout
json
Copy
Edit
{
  "cartItems": [
    {
      "id": 5,
      "quantity": 2,
      "price": 10
    },
    {
      "id": 7,
      "quantity": 1,
      "price": 349
    }
  ]
}
✅ Confirm Payment
http
Copy
Edit
POST /api/payments/:orderId/success
json
Copy
Edit
{
  "paypalInfo": {
    "purchase_units": [
      {
        "payments": {
          "captures": [
            {
              "id": "ABC123",
              "amount": {
                "value": "369.00",
                "currency_code": "USD"
              }
            }
          ]
        }
      }
    ]
  }
}
✅ Contact Form
http
Copy
Edit
POST /api/contact
json
Copy
Edit
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a test message"
}
📂 Project Structure
pgsql
Copy
Edit
project-root/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── connection/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── .env
├── README.md
🚧 Development Notes
All protected routes require login (via session cookie)

Use Postman’s “Cookies” tab to manage sessions

Uploaded images are stored in /uploads

PayPal integration requires a sandbox client ID

📬 Contact
If you face any issues, feel free to open an issue or contact the maintainer.

✅ Ready to use and test now!

yaml
Copy
Edit

---

Would you like me to generate a `schema.sql` template to match your database as well?
