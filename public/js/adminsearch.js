// adminSearch.js
document.getElementById('search-button').addEventListener('input', function(e) {
    const searchTerm = e.target.value;

    fetch(`/admin/search-products?term=${searchTerm}`)
        .then(response => response.json())
        .then(products => {
            updateProductList(products);
        });
});

function updateProductList(products) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    products.forEach(product => {
        // Crear una nueva fila para cada producto
        const row = document.createElement('tr');

        // Agregar las celdas a la fila. Asegúrate de que estas coincidan con la estructura de tus productos
        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.sku}</td>
            <td>${product.product_name}</td>
            <td>${product.licence_name}</td>
            <td>
                <!-- Agregar un enlace para editar el producto -->
                <form action="/admin/edit/${product.product_id}" method="GET">
                    <button type="submit">
                        <input type="hidden" name="_method" value="EDIT">
                        <img src="../img/icons/edit_pencil.svg" alt="Editar ítem">
                    </button>
                </form>
            </td>
            <td>
                <!-- Agregar un enlace para eliminar el producto -->
                <form action="/admin/delete/${product.product_id}" method="POST">
                    <button type="submit">
                        <input type="hidden" name="_method" value="DELETE">
                        <img src="../img/icons/delete_trash.svg" alt="Eliminar ítem">
                    </button>
                </form>
            </td>
        `;

        // Agregar la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    });
}

