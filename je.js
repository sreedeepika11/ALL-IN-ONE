document.addEventListener('DOMContentLoaded', function() {
    // Products Data
    const products = [
        {
            id: 1,
            name: "18K Gold Diamond Ring",
            price: 1299.99,
            image: "https://images.unsplash.com/photo-1603974372035-9d5cbf3d89f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "gold",
            type: "rings",
            description: "Elegant 18K gold ring with brilliant cut diamonds. Handcrafted by our master jewelers with ethically sourced diamonds.",
            material: "18K Gold, Diamond"
        },
        {
            id: 2,
            name: "Platinum Diamond Necklace",
            price: 2499.99,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "platinum",
            type: "necklaces",
            description: "Exquisite platinum necklace with a stunning diamond pendant. Features a 1.5 carat center diamond with surrounding micropavé diamonds.",
            material: "Platinum, Diamond"
        },
        {
            id: 3,
            name: "Diamond Stud Earrings",
            price: 899.99,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "diamond",
            type: "earrings",
            description: "Classic diamond stud earrings with premium quality stones. Each earring features a 0.5 carat round brilliant cut diamond in a secure four-prong setting.",
            material: "14K White Gold, Diamond"
        },
        {
            id: 4,
            name: "22K Gold Bangle Bracelet",
            price: 799.99,
            image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "gold",
            type: "bracelets",
            description: "Traditional 22K gold bangle bracelet with intricate hand-engraved designs. Made from pure 22 karat gold with a secure clasp.",
            material: "22K Gold"
        },
        {
            id: 5,
            name: "Platinum Engagement Ring",
            price: 3499.99,
            image: "https://images.unsplash.com/photo-1603974372035-96a2bc6f8a9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "platinum",
            type: "rings",
            description: "Stunning platinum engagement ring with a 2 carat center diamond. Features a six-prong setting with micropavé diamonds on the band.",
            material: "Platinum, Diamond"
        },
        {
            id: 6,
            name: "Gold Diamond Tennis Bracelet",
            price: 1999.99,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            category: "gold",
            type: "bracelets",
            description: "Elegant 18K gold tennis bracelet with round brilliant cut diamonds. Features a secure box clasp with safety chain.",
            material: "18K Gold, Diamond"
        }
    ];

    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Shopping Cart
    let cart = [];

    // Display Products
    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            productCard.dataset.type = product.type;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Add event listeners to product cards for quick view
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't open quick view if clicking on "Add to Cart" button
                if (!e.target.classList.contains('add-to-cart')) {
                    const productId = parseInt(this.querySelector('.add-to-cart').dataset.id);
                    openQuickView(productId);
                }
            });
        });
    }

    // Filter Products
    function filterProducts(filter) {
        if (filter === 'all') {
            displayProducts(products);
            return;
        }
        
        const filteredProducts = products.filter(product => 
            product.category === filter || product.type === filter
        );
        
        displayProducts(filteredProducts);
    }

    // Add to Cart
    function addToCart(e) {
        e.stopPropagation(); // Prevent triggering the product card click event
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
    }

    // Update Cart
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="text" class="cart-item-qty" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                                   </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease Quantity
function decreaseQuantity() {
    const productId = parseInt(this.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Increase Quantity
function increaseQuantity() {
    const productId = parseInt(this.dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Remove Item
function removeItem() {
    const productId = parseInt(this.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Open Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    
    document.querySelector('.modal-product-image img').src = product.image;
    document.querySelector('.modal-product-title').textContent = product.name;
    document.querySelector('.modal-product-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.modal-product-description').textContent = product.description;
    document.querySelector('.product-category').textContent = product.category;
    document.querySelector('.product-material').textContent = product.material;
    
    // Update "Add to Cart" button in modal
    const addToCartModal = document.querySelector('.add-to-cart-modal');
    addToCartModal.dataset.id = product.id;
    addToCartModal.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        closeQuickView();
    });
    
    quickViewModal.classList.add('active');
}

// Close Quick View
function closeQuickView() {
    quickViewModal.classList.remove('active');
}

// Event Listeners
filterBtns.forEach(button => {
    button.addEventListener('click', function() {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterProducts(this.dataset.filter);
    });
});

cartIcon.addEventListener('click', function() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
});

closeCart.addEventListener('click', function() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

cartOverlay.addEventListener('click', function() {
    cartSidebar.classList.remove('active');
    this.classList.remove('active');
    quickViewModal.classList.remove('active');
});

hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
});

closeModal.addEventListener('click', closeQuickView);
modalOverlay.addEventListener('click', closeQuickView);

// Initialize
displayProducts(products);

// Scroll Event for Navbar
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});
