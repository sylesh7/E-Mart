// Cart functionality
let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        document.querySelector('.cart-count').textContent = cartCount;
        alert('Item added to cart!');
    });
});

// Form handling
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your login logic here
    alert('Login functionality to be implemented');
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your signup logic here
    alert('Signup functionality to be implemented');
}); 