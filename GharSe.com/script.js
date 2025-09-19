// GharSe Application - Main JavaScript File

// Global state management
class AppState {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.kitchens = [];
        this.orders = [];
        this.isAuthenticated = false;
        this.currentLocation = '';
        this.selectedCuisine = 'all';
        
        // Initialize data from localStorage
        this.loadFromStorage();
        this.initializeDefaultData();
    }

    loadFromStorage() {
        const userData = localStorage.getItem('gharSe_user');
        const cartData = localStorage.getItem('gharSe_cart');
        const ordersData = localStorage.getItem('gharSe_orders');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isAuthenticated = true;
        }
        
        if (cartData) {
            this.cart = JSON.parse(cartData);
        }
        
        if (ordersData) {
            this.orders = JSON.parse(ordersData);
        }
    }

    saveToStorage() {
        if (this.currentUser) {
            localStorage.setItem('gharSe_user', JSON.stringify(this.currentUser));
        }
        localStorage.setItem('gharSe_cart', JSON.stringify(this.cart));
        localStorage.setItem('gharSe_orders', JSON.stringify(this.orders));
    }

    initializeDefaultData() {
        // Initialize with sample kitchens data
        if (!localStorage.getItem('gharSe_kitchens')) {
            this.kitchens = [
                {
                    id: 'k1',
                    name: 'Mamta\'s Bengali Kitchen',
                    cuisine: 'bengali',
                    location: 'Kolkata, West Bengal',
                    rating: 4.8,
                    reviews: 156,
                    priceRange: '₹80-150',
                    description: 'Authentic Bengali home cooking with traditional recipes passed down through generations.',
                    dishes: [
                        { id: 'd1', name: 'Fish Curry with Rice', price: 120, image: '🐟' },
                        { id: 'd2', name: 'Aloo Posto', price: 80, image: '🥔' },
                        { id: 'd3', name: 'Mishti Doi', price: 40, image: '🍮' }
                    ],
                    cook: {
                        name: 'Mamta Das',
                        experience: '15 years',
                        speciality: 'Bengali Traditional Cuisine'
                    }
                },
                {
                    id: 'k2',
                    name: 'Dosa Corner by Lakshmi',
                    cuisine: 'south-indian',
                    location: 'Bangalore, Karnataka',
                    rating: 4.6,
                    reviews: 203,
                    priceRange: '₹60-120',
                    description: 'Crispy dosas and authentic South Indian breakfast items made fresh daily.',
                    dishes: [
                        { id: 'd4', name: 'Masala Dosa', price: 80, image: '🥞' },
                        { id: 'd5', name: 'Sambar Rice', price: 70, image: '🍚' },
                        { id: 'd6', name: 'Filter Coffee', price: 30, image: '☕' }
                    ],
                    cook: {
                        name: 'Lakshmi Prasad',
                        experience: '12 years',
                        speciality: 'South Indian Breakfast'
                    }
                },
                {
                    id: 'k3',
                    name: 'Punjabi Tadka by Simran',
                    cuisine: 'punjabi',
                    location: 'Delhi, NCR',
                    rating: 4.7,
                    reviews: 189,
                    priceRange: '₹100-200',
                    description: 'Rich and flavorful Punjabi cuisine with authentic spices and cooking methods.',
                    dishes: [
                        { id: 'd7', name: 'Butter Chicken', price: 150, image: '🍗' },
                        { id: 'd8', name: 'Dal Makhani', price: 120, image: '🍛' },
                        { id: 'd9', name: 'Naan', price: 40, image: '🫓' }
                    ],
                    cook: {
                        name: 'Simran Kaur',
                        experience: '10 years',
                        speciality: 'Punjabi Home Style'
                    }
                },
                {
                    id: 'k4',
                    name: 'Gujarati Thali House',
                    cuisine: 'gujarati',
                    location: 'Ahmedabad, Gujarat',
                    rating: 4.9,
                    reviews: 178,
                    priceRange: '₹90-160',
                    description: 'Complete Gujarati thali experience with variety of traditional dishes.',
                    dishes: [
                        { id: 'd10', name: 'Gujarati Thali', price: 140, image: '🍽️' },
                        { id: 'd11', name: 'Dhokla', price: 60, image: '🟡' },
                        { id: 'd12', name: 'Kheer', price: 50, image: '🥛' }
                    ],
                    cook: {
                        name: 'Meera Patel',
                        experience: '18 years',
                        speciality: 'Traditional Gujarati Cuisine'
                    }
                }
            ];
            localStorage.setItem('gharSe_kitchens', JSON.stringify(this.kitchens));
        } else {
            this.kitchens = JSON.parse(localStorage.getItem('gharSe_kitchens'));
        }
    }

    // Authentication methods
    login(email, password) {
        // Simulate authentication
        const users = JSON.parse(localStorage.getItem('gharSe_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveToStorage();
            return { success: true, user };
        }
        
        return { success: false, message: 'Invalid email or password' };
    }

    register(userData) {
        const users = JSON.parse(localStorage.getItem('gharSe_users') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'User already exists with this email' };
        }
        
        const newUser = {
            id: 'u' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('gharSe_users', JSON.stringify(users));
        
        this.currentUser = newUser;
        this.isAuthenticated = true;
        this.saveToStorage();
        
        return { success: true, user: newUser };
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.cart = [];
        localStorage.removeItem('gharSe_user');
        localStorage.removeItem('gharSe_cart');
        this.saveToStorage();
    }

    // Cart methods
    addToCart(kitchenId, dish) {
        const existingItem = this.cart.find(item => 
            item.kitchenId === kitchenId && item.dish.id === dish.id
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: 'ci' + Date.now(),
                kitchenId,
                dish,
                quantity: 1
            });
        }
        
        this.saveToStorage();
        this.updateCartUI();
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveToStorage();
        this.updateCartUI();
    }

    updateCartQuantity(itemId, quantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartUI();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.dish.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage();
        this.updateCartUI();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartToggle = document.getElementById('cartToggle');

        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;

        // Show/hide cart toggle
        if (cartToggle) {
            if (totalItems > 0) {
                cartToggle.classList.remove('hidden');
            } else {
                cartToggle.classList.add('hidden');
            }
        }

        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            } else {
                this.cart.forEach(item => {
                    const kitchen = this.kitchens.find(k => k.id === item.kitchenId);
                    const cartItemHTML = `
                        <div class="cart-item">
                            <div class="cart-item-info">
                                <h4>${item.dish.name}</h4>
                                <p>${kitchen ? kitchen.name : 'Unknown Kitchen'}</p>
                                <div class="quantity-controls">
                                    <button onclick="app.updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="app.updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                            </div>
                            <div class="cart-item-price">
                                ₹${item.dish.price * item.quantity}
                            </div>
                        </div>
                    `;
                    cartItems.innerHTML += cartItemHTML;
                });
            }
        }

        // Update cart total
        if (cartTotal) {
            cartTotal.textContent = this.getCartTotal();
        }
    }

    // Order methods
    createOrder(orderData) {
        const order = {
            id: 'o' + Date.now(),
            userId: this.currentUser?.id,
            items: [...this.cart],
            total: this.getCartTotal(),
            status: 'placed',
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
            ...orderData
        };
        
        this.orders.push(order);
        this.clearCart();
        this.saveToStorage();
        
        return order;
    }

    // Kitchen filtering methods
    getFilteredKitchens() {
        let filtered = this.kitchens;
        
        if (this.selectedCuisine !== 'all') {
            filtered = filtered.filter(kitchen => kitchen.cuisine === this.selectedCuisine);
        }
        
        if (this.currentLocation) {
            // Simple location matching - in real app, this would be more sophisticated
            filtered = filtered.filter(kitchen => 
                kitchen.location.toLowerCase().includes(this.currentLocation.toLowerCase())
            );
        }
        
        return filtered;
    }
}

// Initialize global app state
const app = new AppState();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateAuthUI();
    app.updateCartUI();
    setupEventListeners();
    displayKitchens();
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.getElementById('userMenu');
    
    if (app.isAuthenticated) {
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.classList.remove('hidden');
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.classList.add('hidden');
    }
}

function setupEventListeners() {
    // Auth form submission
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }

    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Update selected cuisine
            app.selectedCuisine = this.dataset.cuisine;
            displayKitchens();
        });
    });

    // Location input
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.addEventListener('input', function() {
            app.currentLocation = this.value;
        });
    }
}

// Authentication Functions
function openAuthModal(type) {
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authModalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchText = document.getElementById('authSwitchText');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const locationGroup = document.getElementById('locationGroup');
    
    if (type === 'login') {
        title.textContent = 'Login';
        submitBtn.textContent = 'Login';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="switchAuthMode()">Sign up</a>';
        nameGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
        locationGroup.style.display = 'none';
    } else {
        title.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        switchText.innerHTML = 'Already have an account? <a href="#" onclick="switchAuthMode()">Login</a>';
        nameGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
        locationGroup.style.display = 'block';
    }
    
    modal.classList.remove('hidden');
    modal.dataset.mode = type;
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('hidden');
    document.getElementById('authForm').reset();
}

function switchAuthMode() {
    const modal = document.getElementById('authModal');
    const currentMode = modal.dataset.mode;
    openAuthModal(currentMode === 'login' ? 'register' : 'login');
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const modal = document.getElementById('authModal');
    const mode = modal.dataset.mode;
    const formData = new FormData(e.target);
    
    if (mode === 'login') {
        const result = app.login(formData.get('email'), formData.get('password'));
        if (result.success) {
            closeAuthModal();
            updateAuthUI();
            showMessage('Login successful!', 'success');
        } else {
            showMessage(result.message, 'error');
        }
    } else {
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            location: formData.get('location')
        };
        
        const result = app.register(userData);
        if (result.success) {
            closeAuthModal();
            updateAuthUI();
            showMessage('Registration successful!', 'success');
        } else {
            showMessage(result.message, 'error');
        }
    }
}

function logout() {
    app.logout();
    updateAuthUI();
    showMessage('Logged out successfully!', 'success');
    // Redirect to home if on protected pages
    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('orders')) {
        window.location.href = 'index.html';
    }
}

// Kitchen Display Functions
function displayKitchens() {
    const kitchensGrid = document.getElementById('kitchensGrid');
    if (!kitchensGrid) return;
    
    const kitchens = app.getFilteredKitchens();
    
    if (kitchens.length === 0) {
        kitchensGrid.innerHTML = '<div class="no-results">No kitchens found for your selection. Try different filters.</div>';
        return;
    }
    
    kitchensGrid.innerHTML = '';
    
    kitchens.forEach(kitchen => {
        const kitchenCard = createKitchenCard(kitchen);
        kitchensGrid.appendChild(kitchenCard);
    });
}

function createKitchenCard(kitchen) {
    const card = document.createElement('div');
    card.className = 'kitchen-card fade-in';
    card.onclick = () => openKitchenProfile(kitchen.id);
    
    card.innerHTML = `
        <div class="kitchen-image">
            ${getKitchenEmoji(kitchen.cuisine)}
        </div>
        <div class="kitchen-info">
            <h3 class="kitchen-name">${kitchen.name}</h3>
            <p class="kitchen-cuisine">${formatCuisine(kitchen.cuisine)}</p>
            <p class="kitchen-location">📍 ${kitchen.location}</p>
            <div class="kitchen-rating">
                <span class="rating-stars">${generateStars(kitchen.rating)}</span>
                <span>${kitchen.rating} (${kitchen.reviews} reviews)</span>
            </div>
            <p class="kitchen-price">${kitchen.priceRange}</p>
            <button class="btn btn-primary" onclick="event.stopPropagation(); openKitchenProfile('${kitchen.id}')">
                View Menu
            </button>
        </div>
    `;
    
    return card;
}

function getKitchenEmoji(cuisine) {
    const emojis = {
        'bengali': '🐟',
        'south-indian': '🥞',
        'north-indian': '🍛',
        'punjabi': '🍗',
        'gujarati': '🍽️',
        'maharashtrian': '🥘'
    };
    return emojis[cuisine] || '🍳';
}

function formatCuisine(cuisine) {
    return cuisine.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

// Search and Location Functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // In a real app, you'd reverse geocode these coordinates
                const locationInput = document.getElementById('locationInput');
                if (locationInput) {
                    locationInput.value = 'Current Location';
                    app.currentLocation = 'Current Location';
                }
                showMessage('Location detected successfully!', 'success');
            },
            error => {
                showMessage('Could not detect location. Please enter manually.', 'error');
            }
        );
    } else {
        showMessage('Geolocation is not supported by this browser.', 'error');
    }
}

function searchKitchens() {
    const kitchensSection = document.getElementById('kitchensSection');
    if (kitchensSection) {
        kitchensSection.scrollIntoView({ behavior: 'smooth' });
        displayKitchens();
    }
}

// Kitchen Profile Functions
function openKitchenProfile(kitchenId) {
    // Store kitchen ID and redirect to kitchen profile page
    localStorage.setItem('selectedKitchen', kitchenId);
    window.location.href = 'kitchen-profile.html';
}

// Cart Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('hidden');
}

function proceedToCheckout() {
    if (!app.isAuthenticated) {
        openAuthModal('login');
        showMessage('Please login to proceed with checkout', 'error');
        return;
    }
    
    if (app.cart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Navigation Functions
function showDashboard() {
    window.location.href = 'dashboard.html';
}

function showOrders() {
    window.location.href = 'orders.html';
}

function openCookRegistration() {
    if (!app.isAuthenticated) {
        openAuthModal('login');
        showMessage('Please login first to register as a cook', 'error');
        return;
    }
    
    window.location.href = 'cook-dashboard.html';
}

// Utility Functions
function showMessage(text, type = 'info') {
    // Create message element
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Add to page
    document.body.appendChild(message);
    
    // Position message
    message.style.position = 'fixed';
    message.style.top = '100px';
    message.style.right = '20px';
    message.style.zIndex = '3000';
    message.style.minWidth = '300px';
    

    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Export app instance for use in other pages
window.app = app;
// === NUTRITIONIST PAGE SCRIPT START ===

// Dummy data for real nutritionists
const nutritionistsData = [
  {
    name: "Dr. Anjali Sharma",
    location: "Kolkata",
    phone: "9876543210",
    rating: 4.9,
    image: "https://via.placeholder.com/80"
  },
  {
    name: "Dr. Rohit Das",
    location: "Bangalore",
    phone: "9123456780",
    rating: 4.8,
    image: "https://via.placeholder.com/80"
  },
  {
    name: "Dr. Meera Iyer",
    location: "Delhi",
    phone: "9988776655",
    rating: 4.7,
    image: "https://via.placeholder.com/80"
  }
];

// Handle tab switching between real and AI nutritionist
function switchTab(type) {
  const tabHuman = document.getElementById("tab-human");
  const tabAI = document.getElementById("tab-ai");
  const sectionHuman = document.getElementById("section-human");
  const sectionAI = document.getElementById("section-ai");

  tabHuman.classList.remove("active");
  tabAI.classList.remove("active");
  sectionHuman.classList.remove("active");
  sectionAI.classList.remove("active");

  if (type === "human") {
    tabHuman.classList.add("active");
    sectionHuman.classList.add("active");
  } else {
    tabAI.classList.add("active");
    sectionAI.classList.add("active");
    showMessage("AI Nutritionist feature coming soon!", "info");
  }
}

// Search and display nutritionists based on location
function searchNutritionists() {
  const locationInput = document.getElementById("nutriLocation");
  const container = document.getElementById("nutritionistCards");

  const searchTerm = locationInput.value.toLowerCase().trim();
  container.innerHTML = "";

  const results = nutritionistsData.filter(nutri =>
    nutri.location.toLowerCase().includes(searchTerm)
  );

  if (results.length === 0) {
    container.innerHTML = `<p>No nutritionists found in your area.</p>`;
    return;
  }

  results.forEach(nutri => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${nutri.image}" alt="${nutri.name}">
      <h3>${nutri.name}</h3>
      <p>📍 ${nutri.location}</p>
      <p>📞 ${nutri.phone}</p>
      <div class="rating">${generateStars(nutri.rating)} (${nutri.rating})</div>
      <button class="btn-chat">Chat</button>
    `;
    container.appendChild(card);
  });
}

// Helper function to generate star ratings
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += "⭐";
  }
  return stars;
}

// === NUTRITIONIST PAGE SCRIPT END ===
