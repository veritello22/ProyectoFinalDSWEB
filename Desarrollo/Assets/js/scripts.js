document.addEventListener("DOMContentLoaded", () => {

/* ========================================================================
   FAVORITOS – SOLO localStorage
======================================================================== */

// Crear array si no existe
if (!localStorage.getItem("favoriteProducts")) {
    localStorage.setItem("favoriteProducts", JSON.stringify([]));
}

const favoriteButtons = document.querySelectorAll(".favorite-btn");

// Marca corazones activados en el catálogo
favoriteButtons.forEach(btn => {
    const card = btn.closest(".product-card");
    if (!card) return;

    const title = card.querySelector(".card-title").textContent.trim();
    updateFavoriteIcon(btn, title);

    btn.addEventListener("click", () => toggleFavorite(card, btn));
});

/**
 * Alternar favorito
 */
function toggleFavorite(card, btn) {
    const title = card.querySelector(".card-title").textContent.trim();
    const price = card.querySelector(".card-text").textContent.trim();
    const image = card.querySelector("img").getAttribute("src");

    let favorites = JSON.parse(localStorage.getItem("favoriteProducts"));

    const exists = favorites.some(p => p.title === title);

    if (exists) {
        favorites = favorites.filter(p => p.title !== title);
    } else {
        favorites.push({ title, price, image });
    }

    localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
    updateFavoriteIcon(btn, title);
}

/**
 * Actualiza icono visual del corazón
 */
function updateFavoriteIcon(btn, title) {
    const favorites = JSON.parse(localStorage.getItem("favoriteProducts"));
    const isFav = favorites.some(p => p.title === title);

    const icon = btn.querySelector("i");
    if (!icon) return;

    if (isFav) {
        icon.classList.remove("bi-heart");
        icon.classList.add("bi-heart-fill", "text-danger");
    } else {
        icon.classList.remove("bi-heart-fill", "text-danger");
        icon.classList.add("bi-heart");
    }
}

/* ========================================================================
   MOSTRAR FAVORITOS EN favs.html
======================================================================== */
function renderFavorites() {
    const container = document.getElementById("favContainer");
    const noFavs = document.getElementById("no-favs-message");

    if (!container) return;

    let favorites = JSON.parse(localStorage.getItem("favoriteProducts"));

    if (!favorites || favorites.length === 0) {
        container.innerHTML = "";
        if (noFavs) noFavs.style.display = "block";
        return;
    }

    if (noFavs) noFavs.style.display = "none";
    container.innerHTML = "";

    favorites.forEach(item => {
        container.innerHTML += `
            <div class="col">
                <div class="card product-card">
                    <div class="card-img-top ratio ratio-1x1 bg-light">
                        <img src="${item.image}" class="object-fit-cover w-100 h-100" />
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.price}</p>

                        <button class="favorite-btn btn btn-outline-danger remove-fav">
                            <i class="bi bi-heart-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    // Botones de eliminación dentro del listado
    document.querySelectorAll(".remove-fav").forEach(btn => {
        btn.addEventListener("click", () => {
            const title = btn.closest(".product-card")
                .querySelector(".card-title").textContent.trim();

            favorites = favorites.filter(p => p.title !== title);
            localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
            renderFavorites();
        });
    });
}

// Si estamos en la página de favoritos → renderizar
if (window.location.href.includes("favs")) {
    renderFavorites();
}

/* ========================================================================
   BÚSQUEDA Y FILTROS EN CATÁLOGO
======================================================================== */

const searchInput = document.querySelector('.search-input-container input[type="search"]') ||
                     document.getElementById("searchInput");

const productCards = document.querySelectorAll(".menu-catalogo .product-card, .product-card");
const filterButtons = document.querySelectorAll('.btn-outline-secondary, .btn-dark');

/**
 * Filtra productos por texto
 */
const filterProducts = (text) => {
    const search = text.toLowerCase().trim();

    productCards.forEach(card => {
        const col = card.closest(".col");
        if (!col) return;

        const tags = col.getAttribute("data-filter") || "";
        const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";

        const match = !search ||
            title.includes(search) ||
            tags.toLowerCase().includes(search);

        col.style.display = match ? "block" : "none";
    });

    // reset estado de filtros
    filterButtons.forEach(btn => {
        btn.classList.remove("active", "btn-dark");
        btn.classList.add("btn-outline-secondary");
    });
};

// Escribir en la barra busca
if (searchInput) {
    searchInput.addEventListener("keyup", e => filterProducts(e.target.value));
}

// Botones de filtro
filterButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();

        const filterValue = btn.textContent.toLowerCase().trim();

        searchInput && (searchInput.value = "");

        // Visual
        filterButtons.forEach(b => {
            b.classList.remove("active", "btn-dark");
            b.classList.add("btn-outline-secondary");
        });

        btn.classList.add("active", "btn-dark");

        productCards.forEach(card => {
            const col = card.closest(".col");
            const tags = col.getAttribute("data-filter") || "";

            const show = filterValue === "todo" ||
                          tags.toLowerCase().includes(filterValue);

            col.style.display = show ? "block" : "none";
        });
    });
});


});
