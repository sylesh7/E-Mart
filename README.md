1. FILE STRUCTURE :

grocery-app/
├── server.js             # Entry point for the Node.js server
├── package.json          # Project dependencies
├── config/               # Configuration files
│   └── db.js             # MySQL database connection
├── public/               # Frontend files
│   ├── index.html        # Login page
│   ├── cart.html         # Cart page
│   └── grocery.html      # Grocery list page
└── routes/               # Route handlers
    └── api.js            # API endpoints for login, cart, grocery


2. MYSQL TABLES AND QUERIES :

CREATE DATABASE grocery_app;

USE grocery_app;

-- Login Info Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Cart Table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS grocery_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    purchased BOOLEAN DEFAULT FALSE
);

-- Add some items for testing
INSERT INTO grocery_list (item_name, quantity, price) VALUES 
('Apple', 10, 20.50),
('Banana', 5, 15.00),
('Milk', 2, 50.00),
('Bread', 1, 30.00);

ALTER TABLE users ADD COLUMN email VARCHAR(100);

CREATE TABLE IF NOT EXISTS signin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure the login table exists as well
CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);


DELIMITER //

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    -- Insert into signin table
    INSERT INTO signin (username, password, email)
    VALUES (NEW.username, NEW.password, NEW.email);

    -- Insert into login table
    INSERT INTO login (username, password)
    VALUES (NEW.username, NEW.password);
END //

DELIMITER ;

CREATE TABLE IF NOT EXISTS order_details (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100),
    quantity INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


3. CMD COMMANDS FOR JS :

mkdir grocery-app
cd grocery-app
npm init -y
npm install express mysql body-parser
npm install mysql2

node server.js

4.RUN THE HTML PAGES IN YOUR BROWSER :

Login: http://localhost:3000/index.html

Cart: http://localhost:3000/cart.html

Grocery List: http://localhost:3000/grocery.html

Sign up: http://localhost:3000/signup.html
