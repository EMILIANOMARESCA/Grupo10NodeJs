
window.addEventListener("load", function() {
    let botonesCompra = document.querySelectorAll(".add_cart");
    let productQuantity = this.document.getElementById("productQuantity");
    

    // Itera sobre cada botón y agrega un evento
    botonesCompra.forEach(function(boton) {
        boton.addEventListener("click", function(e) {
            if(localStorage.carrito){
                let carrito = JSON.parse(localStorage.carrito)

                let index = carrito.findIndex((prod) => prod.product_id == e.target.dataset.id)
                if(index != -1){
                    carrito[index].quantity += parseFloat(productQuantity.value);
                }else{
                carrito.push({product_id:e.target.dataset.id,quantity:parseFloat(productQuantity.value)})

                }
                localStorage.setItem('carrito',JSON.stringify(carrito));
                mostrarMensajeExito('Producto agregado al carrito con éxito');
            }else{
                localStorage.setItem("carrito",JSON.stringify([{product_id:e.target.dataset.id,quantity:parseFloat(productQuantity.value)}]))
            }
        });
    });
});

function mostrarMensajeExito(mensaje) {
    // Utiliza un prompt para mostrar el mensaje
    window.alert(mensaje);
   
}


    







