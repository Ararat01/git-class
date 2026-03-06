document.addEventListener('DOMContentLoaded', () => {
    // Current Year Update
    document.getElementById('year').textContent = new Date().getFullYear();

    // Elements
    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const totalPriceEl = document.getElementById('totalPrice');
    const cartCountEl = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toast = document.getElementById('toast');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    // State
    let cart = [];

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');
        hamburger.innerHTML = isActive 
            ? '<span></span><span></span><span></span>' 
            : '<span></span><span></span><span></span>';
            
        // Toggle animation for hamburger lines
        const lines = hamburger.querySelectorAll('span');
        if(isActive) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const lines = hamburger.querySelectorAll('span');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        });
    });

    // Menu Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            menuCards.forEach(card => {
                card.style.display = 'none';
                if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Trigger reflow for animation
                    void card.offsetWidth;
                    card.style.animation = 'fadeIn 0.5s';
                }
            });
        });
    });

    // Add to Cart Logic
    const addToCartBtns = document.querySelectorAll('.cart-add');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            
            // Add to state
            cart.push({ id: Date.now(), name, price });
            
            // Update UI
            updateCartUI();
            
            // Show toast
            showToast(`${name} added to cart!`);
        });
    });

    // Remove from Cart Logic
    cartItemsContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('remove-item')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }
    });

    function updateCartUI() {
        // Update Count
        cartCountEl.textContent = cart.length;
        
        // Update Items List
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:50px;">Your cart is empty.</p>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach(item => {
                total += item.price;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }
        
        // Update Total
        totalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    // Modal Toggles
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });

    // Toast Function
    function showToast(message) {
        toast.textContent = message;
        toast.className = 'toast show';
        
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // 70px offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initial Render
    updateCartUI();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if(window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        navbar.style.padding = '5px 0';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        navbar.style.padding = '10px 0';
    }
});
