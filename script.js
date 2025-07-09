document.addEventListener('DOMContentLoaded', () => {

    // ---------- CONFIGURACIÓN ----------
    // ¡IMPORTANTE! Reemplaza este número con tu número de WhatsApp real, incluyendo el código de país (sin el +)
    const WHATSAPP_NUMBER = '5491125019038'; // Ejemplo: 54 para Argentina, 9 para CABA, seguido del número.

    // ---------- BASE DE DATOS DE PRODUCTOS ----------
    const products = [
        // Combos
        { id: 1, name: 'Combo Fernet Branca + Coca-Cola 2.25L', price: 15.50, image: './img/Combo Fernet.png', category: 'combos' },
        { id: 2, name: 'Combo Gin Bombay + 4 Tónicas', price: 25.00, image: './img/Combo Gin Bombay.png', category: 'combos' },
        { id: 3, name: 'Combo Smirnoff + Jugo Naranja', price: 12.00, image: './img/Combo Vodka.png', category: 'combos' },
        // Bebidas Alcohólicas
        { id: 4, name: 'Whisky Johnnie Walker Black Label', price: 35.00, image: './img/Whisky Johnnie Walker Black Label.png', category: 'spirits' },
        { id: 5, name: 'Ron Havana Club 7 Años', price: 22.00, image: 'https://via.placeholder.com/300x300.png?text=Havana+7', category: 'spirits' },
        { id: 6, name: 'Cerveza Corona Pack x6', price: 8.50, image: 'https://via.placeholder.com/300x300.png?text=Corona+Pack', category: 'spirits' },
        { id: 7, name: 'Vino Malbec Rutini', price: 18.00, image: 'https://via.placeholder.com/300x300.png?text=Vino+Rutini', category: 'spirits' },
        // Gaseosas
        { id: 8, name: 'Coca-Cola 2.25L', price: 3.00, image: 'https://via.placeholder.com/300x300.png?text=Coca-Cola', category: 'sodas' },
        { id: 9, name: 'Agua Tónica Britvic 200ml', price: 1.50, image: 'https://via.placeholder.com/300x300.png?text=Tónica', category: 'sodas' },
        { id: 10, name: 'Speed Energizante', price: 2.00, image: 'https://via.placeholder.com/300x300.png?text=Speed', category: 'sodas' },
    ];

    // ---------- ESTADO DE LA APLICACIÓN ----------
    let cart = JSON.parse(localStorage.getItem('altokeRokeCart')) || [];

    // ---------- SELECTORES DEL DOM ----------
    const comboProductsContainer = document.getElementById('combo-products');
    const spiritProductsContainer = document.getElementById('spirit-products');
    const sodaProductsContainer = document.getElementById('soda-products');
    const cartIconContainer = document.querySelector('.cart-icon-container');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCounterEl = document.getElementById('cart-counter');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const checkoutForm = document.getElementById('checkout-form');


    // ---------- FUNCIONES ----------

    function renderProducts() {
        if (!comboProductsContainer || !spiritProductsContainer || !sodaProductsContainer) return;
        comboProductsContainer.innerHTML = '';
        spiritProductsContainer.innerHTML = '';
        sodaProductsContainer.innerHTML = '';

        products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>$${product.price.toFixed(2)}</p>
                        <button class="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito</button>
                    </div>
                </div>
            `;
            if (product.category === 'combos') {
                comboProductsContainer.innerHTML += productCard;
            } else if (product.category === 'spirits') {
                spiritProductsContainer.innerHTML += productCard;
            } else {
                sodaProductsContainer.innerHTML += productCard;
            }
        });
    }

    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showFeedback(`${product.name} añadido al carrito!`);
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #888;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                totalItems += item.quantity;
                const cartItemEl = `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info"><h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p></div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}">✕</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemEl;
            });
        }
        cartTotalEl.innerText = `Total: $${total.toFixed(2)}`;
        cartCounterEl.innerText = totalItems;
        checkoutBtn.disabled = cart.length === 0;
        localStorage.setItem('altokeRokeCart', JSON.stringify(cart));
    }

    function changeQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;
        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        updateCart();
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    function clearCart() {
        cart = [];
        updateCart();
    }

    // AQUÍ ESTÁN LAS FUNCIONES CORRECTAMENTE MODIFICADAS
    function openCheckoutModal() {
        if (cart.length === 0) {
            showFeedback('Tu carrito está vacío.', 'error');
            return;
        }
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
        // Novedad: Activamos el modo fiesta
        document.body.classList.add('party-mode-active');
        checkoutModal.classList.add('open');
        checkoutModalOverlay.classList.add('show');
    }

    function closeCheckoutModal() {
        // Novedad: Desactivamos el modo fiesta
        document.body.classList.remove('party-mode-active');
        checkoutModal.classList.remove('open');
        checkoutModalOverlay.classList.remove('show');
    }

    function handleCheckout(event) {
        event.preventDefault();

        const customerName = document.getElementById('customer-name').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        const customerNotes = document.getElementById('customer-notes').value.trim();

        if (!customerName || !customerAddress) {
            alert('Por favor, completa tu nombre y dirección.');
            return;
        }

        let message = `¡Hola *AltokeRoke*! 🍻 Quiero hacer el siguiente pedido:\n\n`;
        message += `👤 *DATOS DE ENTREGA*\n`;
        message += `-------------------------\n`;
        message += `*Nombre:* ${customerName}\n`;
        message += `*Dirección:* ${customerAddress}\n`;
        if (customerPhone) {
            message += `*Teléfono:* ${customerPhone}\n`;
        }
        message += `*Pago con:* ${paymentMethod}\n`;
        if (customerNotes) {
            message += `*Notas:* ${customerNotes}\n`;
        }
        message += `-------------------------\n\n`;
        message += `🛒 *MI PEDIDO*\n`;

        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `*${item.quantity}x* - ${item.name} ($${item.price.toFixed(2)} c/u)\n`;
            total += subtotal;
        });

        message += `\n*TOTAL A PAGAR: $${total.toFixed(2)}*\n\n`;
        message += `¡Espero la confirmación! Gracias.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${91125019038}?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');

        clearCart();
        closeCheckoutModal();
    }


    function showFeedback(message) {
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'feedback-popup';
        feedbackEl.innerText = message;
        document.body.appendChild(feedbackEl);
        setTimeout(() => {
            feedbackEl.remove();
        }, 2000);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));


    // ---------- EVENT LISTENERS ----------
    cartIconContainer.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    [comboProductsContainer, spiritProductsContainer, sodaProductsContainer].forEach(container => {
        if (container) {
            container.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-cart-btn')) {
                    addToCart(parseInt(e.target.dataset.id));
                }
            });
        }
    });

    cartItemsContainer.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('quantity-btn')) {
            changeQuantity(id, e.target.dataset.action);
        }
        if (e.target.classList.contains('remove-item-btn')) {
            removeItemFromCart(id);
        }
    });

    checkoutBtn.addEventListener('click', openCheckoutModal);
    clearCartBtn.addEventListener('click', clearCart);

    closeModalBtn.addEventListener('click', closeCheckoutModal);
    checkoutModalOverlay.addEventListener('click', closeCheckoutModal);
    checkoutForm.addEventListener('submit', handleCheckout);


    // ---------- INICIALIZACIÓN ----------
    renderProducts();
    updateCart();

}); // <-- FIN DEL BLOQUE document.addEventListener

// Estilo para el popup de feedback
const style = document.createElement('style');
style.innerHTML = `
    .feedback-popup {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: var(--dark-color);
        padding: 1rem 2rem;
        border-radius: 50px;
        z-index: 2000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: fadeInOut 2s ease-in-out;
    }

    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, 20px); }
        10%, 90% { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(style);