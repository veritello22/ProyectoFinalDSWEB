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

// assets/js/scripts.js (continuación)

// ... (todo el código anterior de toggleFavorite y updateFavoriteIcon) ...

    /**
     * Función para renderizar los productos favoritos en la página 'favs.html'.
     */
    function renderFavorites() {
        const favoritesListContainer = document.getElementById('favorites-list');
        const noFavsMessage = document.getElementById('no-favs-message');
        
        // 1. Obtener la lista de favoritos
        const favorites = JSON.parse(sessionStorage.getItem('favorites')) || [];

        // 2. Limpiar el contenedor y mostrar mensaje si no hay favoritos
        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '';
            favoritesListContainer.appendChild(noFavsMessage); // Añadir el mensaje de no hay favoritos
            noFavsMessage.style.display = 'block';
            return;
        }

        // Si hay favoritos, ocultar el mensaje y generar el HTML
        if (noFavsMessage) noFavsMessage.style.display = 'none';
        
        let htmlContent = '';

        favorites.forEach(item => {
            // Generar una tarjeta con imagen, nombre, precio y descripción
            // Nota: La imagen se muestra como un placeholder aquí. 
            // En producción, necesitarías guardar la URL de la imagen en el objeto 'item'.
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
        
        // Re-asignar el evento click al botón de favorito para que pueda eliminar el ítem
        document.querySelectorAll('.favorite-btn').forEach(button => {
             const productId = button.dataset.productId;
             button.addEventListener('click', () => {
                 // Llama a toggleFavorite para eliminarlo y luego recarga la lista
                 toggleFavorite(productId, '', '', button);
                 renderFavorites(); // Recargar la lista inmediatamente
             });
        });
    }

    // Asegurarse de que el script se ejecute cuando esté en la página de favoritos
    if (document.body.classList.contains('favs-page')) {
        renderFavorites();
    }
// assets/js/scripts.js (continuación)

document.addEventListener('DOMContentLoaded', () => {
    // ... (código anterior para favoritos, si existe) ...

    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('contactEmail');
    const formAlert = document.getElementById('formAlert');

    // Patrón Regex simple para validar email (se puede mejorar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (form) {
        form.addEventListener('submit', function (event) {
            // Detener el envío del formulario por defecto
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
            
            // Opcional: Deshabilitar formulario y resetear
            form.reset();
            form.classList.remove('was-validated');
        }, false);
    }
    
    /**
     * Muestra una alerta de Bootstrap en la parte superior del formulario.
     * @param {string} message - Mensaje a mostrar.
     * @param {string} type - Clase de Bootstrap para el tipo de alerta (ej: 'alert-success').
     */
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert mt-4 ${type}`;
        formAlert.classList.remove('d-none');
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            formAlert.classList.add('d-none');
        }, 5000);
    }
})})
