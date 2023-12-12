

function vaciarCarrito() {
    localStorage.removeItem("carrito");
}

function calcularTotal(products) {
    return products.reduce(
        (acum, product) => (acum += product.price * product.quantity), 0
    );
}

//INYECTO HTML CON UN FOR EACH
let cartRows = document.querySelector('.container-cart');

//ALMACENO LOS PRODUCTOS
let products = [];


if (localStorage.carrito) {
    let carrito = JSON.parse(localStorage.carrito);
    console.log(carrito)
    if(carrito[0]!=null){
        carrito.forEach((item, index) => {
            console.log(item)
            fetch(`/shop/product/${item.product_id}`)
                .then((res) => res.json())
                .then((product) => {
                    console.log(product)
                    cartRows.innerHTML += `
                    <section class="cart-product">
            <article class="cart-item">
                <img src="../../img/${product[0].image_front}" class="cart-preview__img" alt="producto" />
                <div class="cart-item__text">
                    <h3>${product[0].product_name}</h3>
                    <h4></h4>
                    <br>
                    <p>${product[0].price}</p>
                </div>
            </article>
                            <h4 type="number" class="item__input cart-input">${item.quantity}<h4>
                           
            <article class="total-price">
                <h3>Total:${parseFloat(product[0].price * item.quantity)}</h3>
                <button class="btn-quantity remove-item" data-id="${product[0].product_id}">X</button>
            </article> 
            </section>`;
                    products.push({
                        productId: product[0].product_id,
                        name: product[0].product_name,
                        price: product[0].price,
                        quantity: item.quantity,
    
    
                    })
    
    
    
                }).then(() => {
                    document.querySelector(".cantidadItems").innerHTML = `$ ${Math.round(calcularTotal(products) * 100) / 100}`;
                    document.querySelector(".cart-summary__totalPrice").innerHTML = `$ ${Math.round(calcularTotal(products) * 100) / 100}`;
                }).then(() => {
                    const deleteItems = document.querySelectorAll(".remove-item");
                    
                    deleteItems.forEach(function (botonEliminar) {
                        botonEliminar.addEventListener("click", function (e) {
                            console.log(e.target.dataset.id)
                            const productIdToRemove = e.target.dataset.id;
    
                            // Filtra el carrito para obtener un nuevo array sin el producto a eliminar
                            carrito = carrito.filter(item => item.product_id !== productIdToRemove);
    
                            // Actualiza el carrito en el localStorage con el nuevo array
                            localStorage.setItem("carrito", JSON.stringify(carrito));
                            location.reload();
    
                        });
                    })
                    
                        ///////////////////////////////////////
                    
    
                  
    
    
                   
    
                    ;
    
                });
    
        })
    }else{
        cartRows.innerHTML += `<section class="cart-product">
        <article class="cart-item">
          
         
                <h6 style="font-size:40px;width:170vh;text-align:center;"> CARRITO VACIO </h6>
       
        <article class="total-price">
           
        </article> 
        </section>`
    }
    ;

}