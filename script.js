const products = [
    {
        id: 1,
        name: "Wireless Headphones Pro",
        category: "Audio",
        price: 299.99,
        description: "Premium noise-canceling headphones with studio-quality sound",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
    },
    {
        id: 2,
        name: "Smart Watch Elite",
        category: "Wearables",
        price: 449.99,
        description: "Advanced fitness tracking with heart rate monitoring",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
    },
    {
        id: 3,
        name: "Designer Backpack",
        category: "Fashion",
        price: 159.99,
        description: "Stylish and functional backpack for everyday adventures",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    },
    {
        id: 4,
        name: "Minimalist Sneakers",
        category: "Footwear",
        price: 189.99,
        description: "Comfortable and sleek sneakers for any occasion",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80"
    },
    {
        id: 5,
        name: "Portable Speaker",
        category: "Audio",
        price: 129.99,
        description: "Waterproof Bluetooth speaker with 360° sound",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"
    },
    {
        id: 6,
        name: "Sunglasses Classic",
        category: "Accessories",
        price: 199.99,
        description: "UV protection with timeless design",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80"
    },
    {
        id: 7,
        name: "Mechanical Keyboard",
        category: "Tech",
        price: 179.99,
        description: "RGB backlit with premium switches for gaming and typing",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80"
    },
    {
        id: 8,
        name: "Leather Wallet",
        category: "Accessories",
        price: 79.99,
        description: "Handcrafted genuine leather with RFID protection",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"
    },
    {
        id: 9,
        name: "Coffee Maker Pro",
        category: "Home",
        price: 249.99,
        description: "Programmable coffee maker with thermal carafe",
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80"
    }
];

let cart = [];

const productsGrid = document.getElementById('products-grid');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartClose = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartEmpty = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

function init() {
    renderProducts();
    loadCart();
    setupEventListeners();
}

function renderProducts() {
    let html = '';
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        html += `
        <article class="product-card" data-product-id="${product.id}">
            <img 
                src="${product.image}" 
                alt="${product.name}"
                class="product-image"
                loading="lazy"
            />
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button 
                        class="add-to-cart-btn" 
                        data-product-id="${product.id}"
                        aria-label="Add ${product.name} to cart"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `;
    }
    productsGrid.innerHTML = html;
}

function setupEventListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = parseInt(btn.dataset.productId);
            addToCart(productId);
        }

        if (e.target.closest('.quantity-btn')) {
            const btn = e.target.closest('.quantity-btn');
            const productId = parseInt(btn.dataset.productId);
            const action = btn.dataset.action;
            changeQuantity(productId, action);
        }

        if (e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const productId = parseInt(btn.dataset.productId);
            removeItem(productId);
        }
    });

    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + 1;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    displayToast(`${product.name} added to cart!`);
}

function changeQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (action == 'increase') {
        item.quantity += 1;
    } else if (action == 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeItem(productId);
            return;
        }
    }

    saveCart();
    updateCartDisplay();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    displayToast('Item removed from cart');
}

function updateCartDisplay() {
    let totalItems = 0;
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
        totalPrice += cart[i].price * cart[i].quantity;
    }

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';

        let cartHTML = '';
        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];
            cartHTML += `
            <div class="cart-item" data-product-id="${item.id}">
                <img 
                    src="${item.image}" 
                    alt="${item.name}"
                    class="cart-item-image"
                />
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button 
                            class="quantity-btn" 
                            data-product-id="${item.id}"
                            data-action="decrease"
                            aria-label="Decrease quantity"
                        >-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button 
                            class="quantity-btn" 
                            data-product-id="${item.id}"
                            data-action="increase"
                            aria-label="Increase quantity"
                        >+</button>
                        <button 
                            class="remove-btn" 
                            data-product-id="${item.id}"
                            aria-label="Remove ${item.name} from cart"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        }
        cartItems.innerHTML = cartHTML;
    }
}

function openCart() {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

function handleCheckout() {
    if (cart.length === 0) return;

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }

    alert(`Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo. No actual payment will be processed.`);

    cart = [];
    saveCart();
    updateCartDisplay();
    closeCart();
    displayToast('Order placed successfully!');
}

function displayToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function saveCart() {
    localStorage.setItem('luxecart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('luxecart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

init();
