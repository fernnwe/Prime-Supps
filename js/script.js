document.addEventListener('DOMContentLoaded', () => {
    // ******************************************************
    // LÓGICA DEL MENÚ DE HAMBURGUESA
    // ******************************************************
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }

    // ******************************************************
    // LÓGICA DEL CARRITO DE COMPRAS
    // ******************************************************
    
    // Definiciones de la Interfaz
    const productGrid = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMsg = document.querySelector('.empty-cart-msg'); // Corregido: asumimos que empty-cart-msg está dentro o fuera de cart-items

    const WHATSAPP_NUMBER = '+50581088124';

    // Estado Global del Carrito
    let cart = [];

    // --- FUNCIÓN DE NOTIFICACIÓN TOAST (NUEVA UX) ---
    function showToast(message) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            // Agregar estilos básicos para que se vea bien sin CSS adicional
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.right = '20px';
            toast.style.backgroundColor = '#00ff88';
            toast.style.color = '#1a1a1a';
            toast.style.padding = '15px 25px';
            toast.style.borderRadius = '5px';
            toast.style.zIndex = '2000';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.4s, transform 0.4s';
            toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        // Ocultar después de 2.5 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
        }, 2500);
    }
    // ----------------------------------------------------

    // 1. Función para Actualizar la Interfaz del Carrito
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalElement.textContent = '$0.00';
            return;
        }

        emptyCartMsg.style.display = 'none';
        checkoutBtn.disabled = false;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            const itemSubtotal = item.precio * item.cantidad;
            total += itemSubtotal;

            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <span>${item.nombre}</span> x ${item.cantidad}
                </div>
                <div>
                    $${itemSubtotal.toFixed(2)}
                    <button class="remove-btn" data-index="${index}">❌</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // 2. Función para Agregar Producto (ACTUALIZADA para usar cantidad)
    function addToCart(productId, productName, productPrice, quantity) {
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            // Si el producto ya existe, incrementa la cantidad
            cart[existingItemIndex].cantidad += quantity;
        } else {
            // Si es un producto nuevo, añádelo al carrito
            cart.push({
                id: productId,
                nombre: productName,
                precio: parseFloat(productPrice),
                cantidad: quantity // Usa la cantidad recibida
            });
        }
        
        updateCartUI();
        showToast(`✅ ${quantity}x ${productName} agregado al carrito.`); // Notificación con la cantidad
        
        // Scroll suave al carrito después de agregar el primer artículo
        if (cart.length === 1) { 
            document.getElementById('carrito-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 3. Función para Eliminar Producto
    function removeFromCart(itemIndex) {
        const removedItemName = cart[itemIndex].nombre;
        cart.splice(itemIndex, 1);
        updateCartUI();
        showToast(`🗑️ ${removedItemName} eliminado del carrito.`); // Notificación elegante
    }

    // 4. Generar Enlace de WhatsApp
    function generateWhatsAppLink() {
        if (cart.length === 0) {
            alert('El carrito está vacío. Agrega productos para comprar.');
            return;
        }

        // 1. Generar el mensaje del pedido
        let orderDetails = "🛒 *NUEVO PEDIDO PrimeSupps* 🛒%0A%0A";
        let total = 0;

        cart.forEach(item => {
            const itemSubtotal = item.precio * item.cantidad;
            total += itemSubtotal;
            // Estructura de mensaje mejorada para WhatsApp
            orderDetails += `*${item.nombre}* x ${item.cantidad} ($${itemSubtotal.toFixed(2)})%0A`;
        });

        orderDetails += `%0A➖➖➖➖➖➖➖➖➖➖%0A`;
        orderDetails += `💰 *TOTAL FINAL: $${total.toFixed(2)}*%0A`;
        orderDetails += `➖➖➖➖➖➖➖➖➖➖%0A%0A`;
        orderDetails += "🚀 Por favor, ingrese su *nombre completo* y *dirección exacta* (incluyendo referencias) para la facturación y envío.";

        // 2. Construir la URL de WhatsApp
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderDetails)}`;
        window.open(waLink, '_blank'); 
    }

    // 5. Escuchadores de Eventos

    // Evento de click para los botones "Agregar al Carrito" (MODIFICADO)
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.product-card');
            
            // --- NUEVA LÓGICA: LEER CANTIDAD ---
            const qtyInput = card.querySelector('.product-qty');
            const quantity = parseInt(qtyInput.value); 

            // Validar la cantidad
            if (isNaN(quantity) || quantity <= 0) {
                showToast("⚠️ Debes seleccionar una cantidad válida (mínimo 1).");
                return;
            }
            // ------------------------------------

            const id = card.dataset.id;
            const nombre = card.dataset.nombre;
            const precio = card.dataset.precio;

            // Llamamos a la función con la cantidad
            addToCart(id, nombre, precio, quantity); 
            
            // Opcional: Resetear el input a 1 después de agregar
            qtyInput.value = 1;
        }
    });

    // Evento de click para los botones "Eliminar" del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const indexToRemove = e.target.dataset.index;
            removeFromCart(indexToRemove);
        }
    });

    // Evento de click para el botón "Finalizar Compra"
    checkoutBtn.addEventListener('click', generateWhatsAppLink);

    // Inicializar la interfaz al cargar
    updateCartUI();
});