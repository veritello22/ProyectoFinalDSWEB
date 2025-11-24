// assets/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================================= */
    /* 1. LÓGICA DE FAVORITOS (Botones de Corazón)                               */
    /* ========================================================================= */

    // Inicializa la lista de favoritos si no existe en Session Storage
    if (!sessionStorage.getItem('favorites')) {
        sessionStorage.setItem('favorites', JSON.stringify([]));
    }

    // Selecciona todos los botones de corazón para inicializarlos
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        // Obtener datos del producto para el almacenamiento (asume que el nombre y precio están en la tarjeta)
        const productName = productCard.querySelector('.card-title') ? productCard.querySelector('.card-title').textContent : 'Producto sin nombre';
        const productPrice = productCard.querySelector('.card-text') ? productCard.querySelector('.card-text').textContent : 'Precio no disponible';
        const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, ''); 
        
        // Cargar favoritos al inicio para actualizar el icono
        updateFavoriteIcon(button, productId);

        button.addEventListener('click', () => {
            toggleFavorite(productId, productName, productPrice, button);
        });
    });

    /**
     * Función para alternar el estado de favorito.
     */
    function toggleFavorite(id, name, price, button) {
        let favorites = JSON.parse(sessionStorage.getItem('favorites'));
        const index = favorites.findIndex(item => item.id === id);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            // Se añade la descripción simple para la página de favoritos
            favorites.push({ id, name, price, description: "Breve descripción del producto para la página Favs." });
        }

        sessionStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteIcon(button, id);
    }

    /**
     * Función para actualizar el icono del corazón.
     */
    function updateFavoriteIcon(button, id) {
        let favorites = JSON.parse(sessionStorage.getItem('favorites'));
        const isFavorite = favorites.some(item => item.id === id);
        
        const icon = button.querySelector('i');
        
        if (isFavorite) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
        } else {
            icon.classList.remove('bi-heart-fill', 'text-danger');
            icon.classList.add('bi-heart');
        }
    }


    /* ========================================================================= */
    /* 2. LÓGICA DE FILTRADO DE PRODUCTOS (Sin Tacc, Vegano, Healthy)            */
    /* ========================================================================= */
    
    // Selector que usa la ID que añadimos al contenedor de botones en el HTML
    const filterControls = document.getElementById('filter-buttons'); 
    
    // Selector para todas las columnas de producto dentro de la sección de catálogo
    const productCards = document.querySelectorAll('.menu-catalogo .col'); 

    // Diagnóstico en Consola (F12) - Si este mensaje aparece, el filtro tiene datos para trabajar
    if (productCards.length === 0) {
        console.warn("ADVERTENCIA DE FILTRO: No se encontraron tarjetas de producto. Asegúrate de que todas tengan la clase 'col' y estén dentro de '.menu-catalogo'.");
    }

    if (filterControls && productCards.length > 0) {
        
        filterControls.addEventListener('click', function(event) {
            const target = event.target;
            
            // Verificamos si el clic fue en un botón y si tiene el data-filter
            if (target.tagName === 'BUTTON' && target.dataset.filter) {
                
                // Obtener el filtro activo y normalizar a minúsculas
                const activeFilter = target.dataset.filter.toLowerCase();
                
                // 1. Actualizar el estado visual de los botones
                filterControls.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active', 'btn-dark');
                    btn.classList.add('btn-outline-secondary');
                });
                target.classList.add('active', 'btn-dark');
                target.classList.remove('btn-outline-secondary');
                
                // 2. Ejecutar el filtro
                productCards.forEach(card => {
                    // Obtener las etiquetas del producto (ej: "vegano healthy")
                    // Se normaliza a minúsculas
                    const productTags = (card.dataset.filter || 'todo').toLowerCase(); 
                    
                    // Mostrar si el filtro es "todo" O si las etiquetas del producto incluyen el filtro activo
                    if (activeFilter === 'todo' || productTags.includes(activeFilter)) {
                        card.style.display = 'block'; 
                    } else {
                        card.style.display = 'none'; // Ocultar
                    }
                });
            }
        });
    }

    /* ========================================================================= */
    /* 3. LÓGICA DE RENDERIZADO DE FAVORITOS (Página favs.html)                  */
    /* ========================================================================= */
    
    /**
     * Función para renderizar los productos favoritos en la página 'favs.html'.
     */
    function renderFavorites() {
        const favoritesListContainer = document.getElementById('favorites-list');
        const noFavsMessage = document.getElementById('no-favs-message');
        
        const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '';
            if (noFavsMessage) favoritesListContainer.appendChild(noFavsMessage);
            if (noFavsMessage) noFavsMessage.style.display = 'block';
            return;
        }

        if (noFavsMessage) noFavsMessage.style.display = 'none';
        
        let htmlContent = '';

        favorites.forEach(item => {
            htmlContent += `
                <div class="col">
                    <div class="card mb-3 shadow-sm border-0">
                        <div class="row g-0 align-items-center">
                            
                            <div class="col-4 col-md-2 d-flex justify-content-center">
                                <div class="ratio ratio-1x1 my-2" style="max-width: 100px;">
                                    <img src="https://via.placeholder.com/150/f0f0f0?text=Prod" class="img-fluid rounded-start object-fit-cover" alt="Imagen de ${item.name}">
                                </div>
                            </div>
                            
                            <div class="col-8 col-md-10">
                                <div class="card-body py-3">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <h5 class="card-title fw-bold mb-1">${item.name}</h5>
                                        <button class="btn btn-sm btn-outline-danger favorite-btn ms-3" data-product-id="${item.id}" aria-label="Eliminar de favoritos">
                                            <i class="bi bi-heart-fill text-danger"></i> 
                                        </button>
                                    </div>
                                    <p class="card-text small text-muted">${item.description}</p>
                                    <p class="card-text fw-bold text-success mt-2">${item.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        favoritesListContainer.innerHTML = htmlContent;
        
        // Re-asignar el evento click para eliminar el ítem
        document.querySelectorAll('.favorite-btn').forEach(button => {
            const productId = button.dataset.productId;
            button.addEventListener('click', () => {
                toggleFavorite(productId, '', '', button);
                renderFavorites(); // Recargar la lista
            });
        });
    }

    // Ejecutar renderFavorites si estamos en la página correcta
    if (document.body.classList.contains('favs-page')) {
        renderFavorites();
    }


    /* ========================================================================= */
    /* 4. LÓGICA DE VALIDACIÓN DE FORMULARIO DE CONTACTO (Página contacto.html)  */
    /* ========================================================================= */

    const form = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    const emailInput = document.getElementById('contactEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); 
            event.stopPropagation();

            // 1. Validar campos obligatorios
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                showAlert('Por favor, completa todos los campos obligatorios correctamente.', 'alert-danger');
                return;
            }

            // 2. Validar formato de Email con Regex
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                showAlert('Por favor, verifica el formato del email.', 'alert-danger');
                form.classList.add('was-validated');
                return;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            // Si todas las validaciones pasan, mostrar mensaje de éxito
            showAlert('✅ Mensaje enviado con éxito. ¡Gracias por contactarnos!', 'alert-success');
            
            form.reset();
            form.classList.remove('was-validated');
        }, false);
    }
    
    /**
     * Muestra una alerta de Bootstrap en la parte superior del formulario.
     */
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert mt-4 ${type}`;
        formAlert.classList.remove('d-none');
        
        setTimeout(() => {
            formAlert.classList.add('d-none');
        }, 5000);
    }
    
}); // Cierre del DOMContentLoaded