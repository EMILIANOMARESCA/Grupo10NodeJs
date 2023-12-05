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
                <a href="../admin/edit.html">
                    <img src="../../img/icons/edit_pencil.svg" alt="Editar ítem">
                </a>
            </td>
            <td>
                <a href="../admin/delete/${product.product_id}" onclick="deleteEdit('${product.product_id}')">
                    <img src="../../img/icons/delete_trash.svg" alt="Eliminar ítem">
                </a>
            </td>
        `;

        // Agregar la fila al cuerpo de la tabla
        tableBody.appendChild(row);
    });
}

