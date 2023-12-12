document.addEventListener('DOMContentLoaded', function() {
    const increaseButtons = document.querySelectorAll('.increaseQuantity');
    const decreaseButtons = document.querySelectorAll('.decreaseQuantity');

    increaseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            handleQuantityChange(e.target, 1);
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            handleQuantityChange(e.target, -1);
        });
    });

    function handleQuantityChange(button, change) {
        const itemContainer = button.closest('.cart-product');
        const quantityInput = itemContainer.querySelector('.cart-input');
        const productId = quantityInput.dataset.productId;
        let quantity = parseInt(quantityInput.value) || 1;
        quantity = Math.max(1, quantity + change);
        quantityInput.value = quantity;

        // Envía una solicitud AJAX para actualizar la cantidad en el servidor
        fetch('/shop/cart/update', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el total del producto en el DOM
            const totalPerItem = document.getElementById(`total-${productId}`);
            if (totalPerItem && data.totalPerItem) {
                totalPerItem.innerText = `$${(data.totalPerItem).toFixed(2)}`;
            }

			const qtdtotal = document.getElementById('qtdtotal');
            if (qtdtotal && data.qtdtotal) {
                qtdtotal.innerText = `${data.qtdtotal}`;
            }

            const subtotalGeneralElement = document.getElementById('subtotal');
            if (subtotalGeneralElement && data.subtotal) {
                subtotalGeneralElement.innerText = `$${data.subtotal.toFixed(2)}`;
            }

            const envio = document.getElementById('envio');
            if (envio && data.envio) {
                envio.innerText = `$${data.envio.toFixed(2)}`;
            }

            const totalGeneralElement = document.getElementById('total-general');
            if (totalGeneralElement && data.totalGeneral) {
                totalGeneralElement.innerText = `$${data.totalGeneral.toFixed(2)}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});