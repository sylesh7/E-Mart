const express = require('express');
const router = express.Router();
const db = require('../config/db');

// User Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
      if (err) throw err;
      res.json({
        success: result.length > 0,
        message: result.length ? 'Login Successful' : 'Invalid Credentials'
      });
    });
  });
  

// Fetch all grocery items
router.get('/grocery', (req, res) => {
    db.query('SELECT * FROM grocery_list', (err, results) => {
        if (err) {
            console.error('Error fetching grocery items:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(results);
        }
    });
});


// Add to cart with quantity (no update to grocery list here)
router.post('/cart', (req, res) => {
    const { item_name, quantity } = req.body;

    db.query('SELECT quantity FROM grocery_list WHERE item_name = ?', [item_name], (err, result) => {
        if (err) {
            console.error('Error checking item availability:', err);
            return res.status(500).send('Server Error');
        }

        if (result.length === 0) {
            return res.status(404).send('Item not found in grocery list');
        }

        const availableQuantity = result[0].quantity;

        if (availableQuantity < quantity) {
            return res.status(400).send(`Only ${availableQuantity} of ${item_name} available`);
        }

        // Insert item into the cart without updating the grocery table
        db.query('INSERT INTO cart (item_name, quantity) VALUES (?, ?)', [item_name, quantity], (err) => {
            if (err) {
                console.error('Error adding item to cart:', err);
                return res.status(500).send('Server Error');
            }

            res.send(`Added ${quantity} ${item_name}(s) to cart.`);
        });
    });
});


// Purchase items from the cart and update grocery list
router.post('/purchase', async (req, res) => {
    try {
        // Get all items from the cart
        const [cartItems] = await db.promise().query('SELECT * FROM cart');

        if (cartItems.length === 0) {
            return res.send('Cart is empty');
        }

        // Begin transaction
        await db.promise().beginTransaction();

        for (const item of cartItems) {
            const { item_name, quantity } = item;

            // Insert into order_details
            await db.promise().query(
                'INSERT INTO order_details (item_name, quantity) VALUES (?, ?)', 
                [item_name, quantity]
            );

            // Update grocery list quantity and purchased count in a single query
            await db.promise().query(
                'UPDATE grocery_list SET quantity = GREATEST(quantity - ?, 0), purchased = purchased + ? WHERE item_name = ?',
                [quantity, quantity, item_name]
            );
        }

        // Clear the cart after successful purchase
        await db.promise().query('DELETE FROM cart');

        // Commit transaction
        await db.promise().commit();
        res.send('Purchase successful and cart cleared');
    } catch (err) {
        console.error('Error during purchase:', err);
        // Rollback in case of error
        await db.promise().rollback();
        res.status(500).send('Server Error');
    }
});


  
// Get cart count (sum of all quantities)
router.get('/cart/count', (req, res) => {
    db.query('SELECT SUM(quantity) AS total FROM cart', (err, result) => {
        if (err) {
            console.error('Error fetching cart count:', err);
            res.status(500).send('Server Error');
        } else {
            res.json(result[0]);
        }
    });
});




// Search Grocery Item
router.get('/grocery/:item_name', (req, res) => {
    const itemName = req.params.item_name;
    const searchQuery = 'SELECT item_name, quantity, price FROM grocery_list WHERE item_name = ?';

    db.query(searchQuery, [itemName], (err, result) => {
        if (err) {
            console.error('Error fetching item:', err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }

        if (result.length > 0) {
            res.json({ found: true, item_name: result[0].item_name, quantity: result[0].quantity, price: result[0].price });
        } else {
            res.json({ found: false });
        }
    });
});





// Sign-Up Route
router.post('/signup', (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        console.error('Missing fields: username, password, or email');
        return res.status(400).send('Username, password, and email are required');
    }

    // Check if the username already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server Error');
        }

        if (result.length > 0) {
            return res.send('Username already exists');
        }

        // Only insert into the users table; trigger will handle other tables
        const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, password, email], (err) => {
            if (err) {
                console.error('Error inserting into users table:', err);
                return res.status(500).send('Server Error');
            }
            res.send('Sign-Up Successful');
        });
    });
});

module.exports = router;
