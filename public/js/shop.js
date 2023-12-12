fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const allProducts = data;
        const productsPerPage = 9;
        let currentPage = 1;

        function renderProducts(page) {
        // Calcular el índice del primer y último producto de la página actual
        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = allProducts.slice(startIndex, endIndex);

        // Aquí pondrías tu lógica para renderizar los productos en el DOM
        const productsContainer = document.querySelector('.shop__items');
        productsContainer.innerHTML = ''; // Limpiar productos anteriores

        productsToShow.forEach(product => {
            // Crear y añadir cada producto al DOM
            const productElement = createProductElement(product);
            productsContainer.appendChild(productElement);
        });
        }

        function createProductElement(product) {
        // Crear los elementos HTML para cada producto
        const item = document.createElement('div');
        item.className = 'shop__item';
        // Añadir contenido del producto (imagen, nombre, precio, etc.)
        // ...
        return item;
        }

        function setupPagination(totalProducts) {
        const paginationContainer = document.querySelector('.pagination');
        const totalPages = Math.ceil(totalProducts / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.addEventListener('click', () => {
            currentPage = i;
            renderProducts(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
        }

        // Inicializar la página con la primera página de productos y la paginación
        renderProducts(currentPage);
        setupPagination(allProducts.length);

    })
    .catch(error => console.error('Error al obtener los productos:', error));