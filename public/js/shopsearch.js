// shopSearch.js
document.getElementById('search-button').addEventListener('input', function(e) {
    console.log("Evento de entrada detectado"); // Para depuración

    const searchTerm = e.target.value;

    fetch(`/shop/search-products?term=${searchTerm}`)
        .then(response => response.json())
        .then(products => {
            updateProductList(products);
        });
});

function updateProductList(products) {
    // Encuentra el elemento del DOM donde se muestran los productos
    const shopContainer = document.querySelector('.shop__items');

    // Limpia el contenido actual
    shopContainer.innerHTML = '';

    // Itera sobre la lista de productos y crea el HTML para cada uno
    products.forEach(product => {
        const productHTML = `
            <li class="shop__item">
                <article class="card-item">
                    <a class="card-item__link" href="/shop/item/${product.product_id}">
                        <picture class="card-item__cover">
                            <span class="card-item__tag">Nuevo</span>
                            <img class="card-item__img--front" src="../../img${product.image_front}" alt="Figura coleccionable Funko ">
                            <img class="card-item__img--back" src="../../img${product.image_back}" alt="Figura coleccionable Funko en caja">
                        </picture>
                        <div class="card-item__content">
                            <p class="card-item__licence">${product.licence_name}</p>
                            <h4 class="card-item__name">${product.product_name}</h4>
                            <p class="card-item__price">${product.price}</p>
                            <p class="card-item__promo">${product.dues} CUOTAS SIN INTERÉS</p>
                        </div>
                    </a>
                </article>
            </li>
        `;

        // Agrega el HTML del producto al contenedor
        shopContainer.innerHTML += productHTML;
    });
}

