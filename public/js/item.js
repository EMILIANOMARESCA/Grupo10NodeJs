document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('productQuantity');
    const increaseButton = document.getElementById('increaseQuantity');
    const decreaseButton = document.getElementById('decreaseQuantity');

    // Inicializa quantity verificando si el valor actual es un número.
    // Si no es un número, establece el valor inicial en 1.
    let quantity = parseInt(quantityInput.value) || 1;

    quantityInput.addEventListener('input', function(e) {
        // Reemplaza cualquier carácter no numérico por una cadena vacía
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    increaseButton.addEventListener('click', function() {
        quantity++;
        updateQuantity();
    });

    decreaseButton.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            updateQuantity();
        }
    });

    function updateQuantity() {
        quantityInput.value = quantity;
    }
});
