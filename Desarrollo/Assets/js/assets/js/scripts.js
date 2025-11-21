// assets/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa la lista de favoritos si no existe en Session Storage
    if (!sessionStorage.getItem('favorites')) {
        sessionStorage.setItem('favorites', JSON.stringify([]));
    }

    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        // Asignar un ID de producto al botón para identificarlo (idealmente desde el HTML)
        // Por simplicidad, aquí usaré un atributo data. En producción, usarías un ID real de backend.
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        // EJEMPLO: Asumimos que la tarjeta tiene datos (esto debería estar en el HTML)
        const productName = productCard.querySelector('.card-title').textContent;
        const productPrice = productCard.querySelector('.card-text').textContent;
        const productId = productName.toLowerCase().replace(/[^a-z0-9]/g, ''); // Generar un ID simple
        
        // Cargar favoritos al inicio para actualizar el icono
        updateFavoriteIcon(button, productId);

        button.addEventListener('click', () => {
            toggleFavorite(productId, productName, productPrice, button);
        });
    });

    /**
     * Función para alternar el estado de favorito.
     * @param {string} id - ID único del producto.
     * @param {string} name - Nombre del producto.
     * @param {string} price - Precio del producto.
     * @param {HTMLElement} button - El botón de corazón que fue clickeado.
     */
    function toggleFavorite(id, name, price, button) {
        let favorites = JSON.parse(sessionStorage.getItem('favorites'));
        const index = favorites.findIndex(item => item.id === id);

        if (index > -1) {
            // Ya es favorito, lo quitamos
            favorites.splice(index, 1);
        } else {
            // No es favorito, lo añadimos
            favorites.push({ id, name, price, description: "Breve descripción del producto para la página Favs." });
        }

        sessionStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteIcon(button, id);
        
        // Opcional: Notificación visual al usuario
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
            // Corazón lleno (ya es favorito)
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
        } else {
            // Corazón vacío (no es favorito)
            icon.classList.remove('bi-heart-fill', 'text-danger');
            icon.classList.add('bi-heart');
        }
    }
    
    // Aquí iría el código para cargar la página de Favs (secciones/favs.html)
    if (document.body.classList.contains('favs-page')) {
        renderFavorites();
    }
});