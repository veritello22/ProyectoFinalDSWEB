// assets/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================================= */
    /* 1. LÓGICA DE FAVORITOS (toggleFavorite, updateFavoriteIcon, renderFavorites) */
    /* ========================================================================= */

    // Inicializa la lista de favoritos si no existe en Session Storage
    if (!sessionStorage.getItem('favorites')) {
        sessionStorage.setItem('favorites', JSON.stringify([]));
    }

    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        // EJEMPLO: Obtener datos del producto (Asegúrate de que los IDs sean únicos)
        const productName = productCard.querySelector('.card-title').textContent;
        const productPrice = productCard.querySelector('.card-text').textContent;
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
            favorites.push({ id, name, price, description: "Breve descripción del producto para la página Favs." });
        }

        sessionStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteIcon(button, id);
        
        console.log(`Favoritos actualizados. Total: ${favorites.length}`);
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

    /**
     * Función para renderizar los productos favoritos en la página 'favs.html'.
     */
    function renderFavorites() {
        const favoritesListContainer = document.getElementById('favorites-list');
        const noFavsMessage = document.getElementById('no-favs-message');
        
        const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '';
            // El mensaje se crea en favs.html, lo asumimos disponible para simplificar:
            if (noFavsMessage) favoritesListContainer.appendChild(noFavsMessage);
            if (noFavsMessage) noFavsMessage.style.display = 'block';
            return;
        }

        if (noFavsMessage) noFavsMessage.style.display = 'none';
        
        let htmlContent = '';
        // ... (Tu código de generación de HTML para favs.html) ...
        // [Aquí va el resto del código de renderFavorites, lo omito por brevedad pero asumo que funciona]
        
        // ... (Al final de renderFavorites) ...
        // Re-asignar el evento click al botón de favorito para eliminar el ítem
        document.querySelectorAll('.favorite-btn').forEach(button => {
            const productId = button.dataset.productId;
            button.addEventListener('click', () => {
                toggleFavorite(productId, '', '', button);
                renderFavorites(); // Recargar la lista
            });
        });
        
    }

    // Asegurarse de que el script se ejecute cuando esté en la página de favoritos
    if (document.body.classList.contains('favs-page')) {
        renderFavorites();
    }


    /* ========================================================================= */
    /* 2. LÓGICA DE FILTRADO DE PRODUCTOS (Sin Tacc, Vegano, Healthy)            */
    /* ========================================================================= */
    
    // Selector para el contenedor de botones de filtro
    const filterControls = document.querySelector('.col-12.d-flex.flex-wrap'); 
    // Selector para todas las tarjetas de producto
    const productCards = document.querySelectorAll('.menu-catalogo .col'); 

    if (filterControls && productCards.length > 0) {
        
        filterControls.addEventListener('click', function(event) {
            const target = event.target;
            
            // Verificamos si el clic fue en un botón y si tiene el filtro de datos
            if (target.tagName === 'BUTTON' && target.dataset.filter) {
                
                const activeFilter = target.dataset.filter;
                
                // 1. Actualizar el estado visual de los botones
                filterControls.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active', 'btn-dark');
                    btn.classList.add('btn-outline-secondary');
                });
                target.classList.add('active', 'btn-dark');
                target.classList.remove('btn-outline-secondary');
                
                // 2. Ejecutar el filtro
                productCards.forEach(card => {
                    // Nota: Asume que el data-filter en el HTML tiene valores separados por espacios
                    const productTags = card.dataset.filter || 'todo'; 
                    
                    // Mostrar si el filtro es "todo" O si las etiquetas del producto contienen el filtro activo
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
    /* 3. LÓGICA DE VALIDACIÓN DE FORMULARIO DE CONTACTO                         */
    /* ========================================================================= */

    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('contactEmail');
    const formAlert = document.getElementById('formAlert');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (form) {
        form.addEventListener('submit', function (event) {
            // ... (Tu código de validación de formulario de contacto) ...
            event.preventDefault(); 
            event.stopPropagation();
            // ... [Asumo que este bloque está funcional]
        }, false);
    }
    
    /**
     * Muestra una alerta de Bootstrap en la parte superior del formulario.
     */
    function showAlert(message, type) {
        // ... [Asumo que este bloque está funcional]
    }
    
}); // Cierre del DOMContentLoaded