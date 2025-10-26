document.addEventListener('DOMContentLoaded', () => {
    // ******************************************************
    // LÓGICA DEL MENÚ DE HAMBURGUESA (Añadido para Responsive)
    // ******************************************************
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    // 1. Mostrar/Ocultar el menú al hacer clic en el toggle (hamburguesa)
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        
        // 2. Ocultar el menú al hacer clic en un enlace (solo en móvil)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Solo si el menú está activo, lo cerramos
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }

    // ******************************************************
    // LÓGICA DEL CARRITO DE COMPRAS (Original)
    // ******************************************************
    
    // Definiciones de la Interfaz
    const productGrid = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMsg = document.querySelector('.empty-cart-msg');

    // Estado Global del Carrito
    let cart = [];
    const WHATSAPP_NUMBER = '+50581088124';

    // 1. Función para Actualizar la Interfaz del Carrito
    function updateCartUI() {
        // Limpiar la lista de productos
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            // Mostrar mensaje de carrito vacío
            emptyCartMsg.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalElement.textContent = '$0.00';
            return;
        }

        emptyCartMsg.style.display = 'none';
        checkoutBtn.disabled = false;

        // Recorrer el carrito y crear los elementos HTML
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

        // Actualizar el total
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // 2. Función para Agregar Producto
    function addToCart(productId, productName, productPrice) {
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            // Si el producto ya existe, incrementa la cantidad
            cart[existingItemIndex].cantidad += 1;
        } else {
            // Si es un producto nuevo, añádelo al carrito
            cart.push({
                id: productId,
                nombre: productName,
                precio: parseFloat(productPrice),
                cantidad: 1
            });
        }
        updateCartUI();
    }

    // 3. Función para Eliminar Producto
    function removeFromCart(itemIndex) {
        // Elimina el item del arreglo usando su índice
        cart.splice(itemIndex, 1);
        updateCartUI();
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
            orderDetails += `✅ *${item.nombre}* | Cantidad: ${item.cantidad} | Precio U.: $${item.precio.toFixed(2)} | Subtotal: $${itemSubtotal.toFixed(2)}%0A`;
        });

        orderDetails += `%0A➖➖➖➖➖➖➖➖➖➖%0A`;
        orderDetails += `💰 *TOTAL A PAGAR: $${total.toFixed(2)}*%0A`;
        orderDetails += `➖➖➖➖➖➖➖➖➖➖%0A%0A`;
        orderDetails += "Por favor, proporcione su *nombre completo* y *dirección* para la facturación y envío.";

        // 2. Construir la URL de WhatsApp
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${orderDetails}`;
        window.open(waLink, '_blank'); // Abrir en una nueva pestaña/ventana
    }

    // 5. Escuchadores de Eventos

    // Evento de click para los botones "Agregar al Carrito"
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const nombre = card.dataset.nombre;
            const precio = card.dataset.precio;

            addToCart(id, nombre, precio);
            // Pequeña animación visual al agregar
            e.target.textContent = '✅ Agregado!';
            setTimeout(() => {
                e.target.textContent = 'Agregar al Carrito';
            }, 800);
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