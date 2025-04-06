# Grocery App

A simple **Grocery Management Application** with a **Node.js backend** and **MySQL database**. The app allows users to login, view grocery items, add them to their cart, and track orders.
```
## 📂 Project Structure
E-MART/
├── config/
│   └── db.js                  # Database configuration (MongoDB/MySQL)
├── node_modules/              # Installed dependencies (auto-generated)
├── public/                    # Static files (frontend)
│   ├── cart.html              # Shopping cart page
│   ├── grocery.html           # Grocery items page
│   ├── index.html             # Homepage
│   └── signup.html            # User registration page
├── routes/
│   ├── api.js                # Grocery item API routes
├── views/                     # HTML templates (if using server-side rendering)
│   ├── cart.html           # Duplicate? (Move to `public/` if client-side)
│   ├── home.html            # Shared header template
│   ├── home.css               # Homepage styles
│   ├── index.html             # Duplicate? (Consolidate with `public/index.html`)
│   ├── grocery.css              # Login page styles
│   └── login.html
│   └── login.css            # Login page template
├── server.js                  # Backend entry point (Express.js)
├── package.json               # Project metadata and dependencies
├── package-lock.json          # Auto-generated dependency tree
└── README.md                  # Project documentation
```

## 🗄️ Database Setup (MySQL)
### Create Database
```sql
CREATE DATABASE grocery_app;
USE grocery_app;
```
### Create Tables
```sql
-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100)
);

-- Cart Table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1
);

-- Grocery List Table
CREATE TABLE grocery_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    purchased BOOLEAN DEFAULT FALSE
);

-- Insert Sample Data
INSERT INTO grocery_list (item_name, quantity, price) VALUES
('Apple', 10, 20.50),
('Banana', 5, 15.00),
('Milk', 2, 50.00),
('Bread', 1, 30.00);

-- Signin Table
CREATE TABLE signin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login Table
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Order Details Table
CREATE TABLE order_details (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100),
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE grocery_list ADD COLUMN image_url TEXT;


INSERT INTO grocery_list (item_name, price, quantity, image_url) VALUES
('Fresh Apples', 50.00, 100, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'),
('Organic Bananas', 40.00, 120, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'),
('Fresh Milk', 60.00, 80, 'https://images.unsplash.com/photo-1563636619-e9143da7973b'),
('Whole Grain Bread', 45.00, 90, 'https://images.unsplash.com/photo-1509440159596-0249088772ff'),
('Organic Eggs', 70.00, 75, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'),
('Chicken Breast', 150.00, 50, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5'),
('Basmati Rice', 90.00, 100, 'https://images.unsplash.com/photo-1586201375761-83865001e31c'),
('Italian Pasta', 55.00, 85, 'https://images.unsplash.com/photo-1551462147-37885acc36f1'),
('Cheddar Cheese', 80.00, 60, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'),
('Greek Yogurt', 65.00, 70, 'https://images.unsplash.com/photo-1563636619-e9143da7973b'),
('Orange Juice', 50.00, 90, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b'),
('Mixed Vegetables', 60.00, 95, 'https://images.unsplash.com/photo-1540420773420-3366772f4999'),
('Olive Oil', 130.00, 40, 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1'),
('Breakfast Cereal', 75.00, 100, 'https://images.unsplash.com/photo-1563725911583-7d108f720483');
```
### Trigger to Sync Users with Login and Signin Tables
```sql
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO signin (username, password, email)
    VALUES (NEW.username, NEW.password, NEW.email);
    
    INSERT INTO login (username, password)
    VALUES (NEW.username, NEW.password);
END //
DELIMITER ;
```

## 🚀 Getting Started
### 1️⃣ Install Dependencies
```sh
mkdir grocery-app
cd grocery-app
npm init -y
npm install express mysql body-parser
npm install mysql2
```

### 2️⃣ Start the Server
```sh
node server.js
```

## 🌍 Access the Application
- **Login Page:** [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **Cart Page:** [http://localhost:3000/cart.html](http://localhost:3000/cart.html)
- **Grocery List Page:** [http://localhost:3000/grocery.html](http://localhost:3000/grocery.html)
- **Sign-up Page:** [http://localhost:3000/signup.html](http://localhost:3000/signup.html)

## 📌 Features
✅ User Authentication (Signup & Login)
✅ View Grocery Items
✅ Add Items to Cart
✅ Order Tracking
✅ MySQL Database Integration

## 🤝 Contributing
If you want to contribute, fork this repo and submit a pull request. Happy coding!

## 📜 License
This project is open-source and available under the **MIT License**.
