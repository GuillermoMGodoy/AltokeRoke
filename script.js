document.addEventListener('DOMContentLoaded', () => {

    // ---------- CONFIGURACIÓN ----------
    // ¡IMPORTANTE! Reemplaza este número con tu número de WhatsApp real, incluyendo el código de país (sin el +)
    const WHATSAPP_NUMBER = '5491112345678'; // Ejemplo: 54 para Argentina, 9 para CABA, seguido del número.

    // ---------- BASE DE DATOS DE PRODUCTOS ----------
    // Aquí puedes agregar, editar o quitar productos fácilmente.
    const products = [
        // Combos
        { id: 1, name: 'Combo Fernet Branca + Coca-Cola 2.25L', price: 15.50, image: 'https://via.placeholder.com/300x300.png?text=Fernet+Combo', category: 'combos' },
        { id: 2, name: 'Combo Gin Bombay + 4 Tónicas', price: 25.00, image: 'https://via.placeholder.com/300x300.png?text=Gin+Combo', category: 'combos' },
        { id: 3, name: 'Combo Smirnoff + Jugo Naranja', price: 12.00, image: 'https://via.placeholder.com/300x300.png?text=Vodka+Combo', category: 'combos' },

        // Bebidas Alcohólicas
        { id: 4, name: 'Whisky Johnnie Walker Black Label', price: 35.00, image: 'https://via.placeholder.com/300x300.png?text=Johnnie+Black', category: 'spirits' },
        { id: 5, name: 'Ron Havana Club 7 Años', price: 22.00, image: 'https://via.placeholder.com/300x300.png?text=Havana+7', category: 'spirits' },
        { id: 6, name: 'Cerveza Corona Pack x6', price: 8.50, image: 'https://via.placeholder.com/300x300.png?text=Corona+Pack', category: 'spirits' },
        { id: 7, name: 'Vino Malbec Rutini', price: 18.00, image: 'https://via.placeholder.com/300x300.png?text=Vino+Rutini', category: 'spirits' },

        // Gaseosas
        { id: 8, name: 'Coca-Cola 2.25L', price: 3.00, image: 'https://via.placeholder.com/300x300.png?text=Coca-Cola', category: 'sodas' },
        { id: 9, name: 'Agua Tónica Britvic 200ml', price: 1.50, image: 'https://via.placeholder.com/300x300.png?text=Tónica', category: 'sodas' },
        { id: 10, name: 'Speed Energizante', price: 2.00, image: 'https://via.placeholder.com/300x300.png?text=Speed', category: 'sodas' },
    ];

    // ---------- ESTADO DE LA APLICACIÓN ----------
    let cart = JSON.parse(localStorage.getItem('drinkExpressCart')) || [];

    // ---------- SELECTORES DEL DOM ----------
    const comboProductsContainer = document.getElementById('combo-products');
    const spiritProductsContainer = document.getElementById('spirit-products');
    const sodaProductsContainer = document.getElementById('soda-products');
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCounterEl = document.getElementById('cart-counter');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');


    // ---------- FUNCIONES ----------

    // Renderizar productos en la página
    function renderProducts() {
        // Limpiar contenedores antes de renderizar
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

    // Abrir y cerrar el carrito
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }

    // Agregar un producto al carrito
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

    // Actualizar el carrito (UI, total, contador)
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
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
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
        localStorage.setItem('drinkExpressCart', JSON.stringify(cart));
    }

    // Cambiar la cantidad de un item en el carrito
    function changeQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                // Si la cantidad llega a 0, eliminar el item
                cart = cart.filter(item => item.id !== productId);
            }
        }
        updateCart();
    }

    // Remover un item completamente del carrito
    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    // Vaciar todo el carrito
    function clearCart() {
        cart = [];
        updateCart();
    }

    // Enviar pedido a WhatsApp
    function sendOrderToWhatsApp() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. ¡Agrega productos para hacer un pedido!');
            return;
        }

        let message = `¡Hola! 👋 Quisiera hacer el siguiente pedido:\n\n`;
        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `*${item.quantity}x* - ${item.name} ($${subtotal.toFixed(2)})\n`;
            total += subtotal;
        });

        message += `\n*TOTAL DEL PEDIDO: $${total.toFixed(2)}*\n\n`;
        message += `Por favor, confirmame el pedido y los métodos de pago. ¡Gracias!`;

        // Codificar el mensaje para la URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappURL, '_blank');
    }

    // Feedback visual al usuario
    function showFeedback(message) {
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'feedback-popup';
        feedbackEl.innerText = message;
        document.body.appendChild(feedbackEl);
        setTimeout(() => {
            feedbackEl.remove();
        }, 2000);
    }

    // Animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ---------- EVENT LISTENERS ----------
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    document.querySelector('.product-grid-container')?.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });
    // Uso event delegation en los contenedores de productos
    [comboProductsContainer, spiritProductsContainer, sodaProductsContainer].forEach(container => {
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const id = parseInt(e.target.dataset.id);
                addToCart(id);
            }
        });
    });

    cartItemsContainer.addEventListener('click', e => {
        const id = parseInt(e.target.dataset.id);
        if (e.target.classList.contains('quantity-btn')) {
            const action = e.target.dataset.action;
            changeQuantity(id, action);
        }
        if (e.target.classList.contains('remove-item-btn')) {
            removeItemFromCart(id);
        }
    });

    checkoutBtn.addEventListener('click', sendOrderToWhatsApp);
    clearCartBtn.addEventListener('click', clearCart);


    // ---------- INICIALIZACIÓN ----------
    renderProducts();
    updateCart();

});

// Estilo para el popup de feedback, añadirlo al CSS o dejarlo aquí.
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