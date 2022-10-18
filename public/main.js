const socket = io();

let carrito = [];

const crearEtiquetasProductos = (producto) => {
    const { id,nombre,foto,precio } = producto;
    return `
            <tr>
                <td>${nombre}</td>
                <td>$ ${precio}</td>
                <td><img style="width: 5rem" src=${foto} alt=""></td>
                <td><button class="addToCart" data-id="${id}">Agregar al carrito</button></td>
                </tr>`;
}


let carritoContainer = document.getElementById('productsCartContainer');


const cargarCarrito = (cart) => {
    cart.forEach(prod => {
        let div = document.createElement('div');
        div.innerHTML = `
            <h5>${prod.nombre}</h5>
            <span>${prod.precio}</span>
            <span>${prod.cantidad}</span>
            <img style="width: 5rem" src=${prod.img} alt="">
            <button class="deleteProd" data-id="${prod.id}">Eliminar</button>`
        carritoContainer.appendChild(div)
    })

    let comprarCarrito = document.createElement('button')
    comprarCarrito.innerHTML = 'Comprar carrito'
    comprarCarrito.setAttribute('id','comprar')
    carritoContainer.appendChild(comprarCarrito)

    document.querySelectorAll('.deleteProd').forEach(btn => {
        btn.addEventListener('click',(e) => {
            carrito.productos = carrito.productos.filter(prod => prod.id !== parseInt(e.target.dataset.id))
            carritoContainer.innerHTML = ''
            cargarCarrito(carrito.productos)
            socket.emit('deleteProd',carrito)
        })
    })
    document.getElementById('comprar').addEventListener('click',() => {
        socket.emit('deleteCart',carrito)
        let nroOrden = Math.floor(Math.random() * 1000000000)
        carrito._id = nroOrden;
        socket.emit('purchase',carrito)
    })
}

//Creo los eventos para los botones
const addEventToAddCartBtn = () => {
    document.querySelectorAll('.addToCart').forEach(btn => {
        btn.addEventListener('click',(e) => {
            let prodEncontrado = carrito.productos.find(prod => prod.id === parseInt(e.target.dataset.id));

            //Lógica donde veo si existe o no el producto y aumento su cantidad
            if (prodEncontrado) {
                prodEncontrado.cantidad++
                carritoContainer.innerHTML = ''
                cargarCarrito(carrito.productos)
            } else {
                let prodAddToCart = {
                    id: parseInt(e.target.dataset.id),
                    nombre: e.target.parentNode.parentNode.children[0].innerHTML,
                    precio: e.target.parentNode.parentNode.children[1].innerHTML,
                    img: e.target.parentNode.parentNode.children[2].firstElementChild.currentSrc,
                    cantidad: 1
                };
                carrito.productos.push(prodAddToCart)
                carritoContainer.innerHTML = ''
                cargarCarrito(carrito.productos)
            }
            socket.emit('addSameProd',carrito)
        })
    })
}

const agregarProducto = (producto) => {
    if (producto !== '') {
        const productoFinal = producto.map(producto => crearEtiquetasProductos(producto)).join('<br>');
        document.getElementById('productsContainer').innerHTML = productoFinal;
        addEventToAddCartBtn();
    } else {
        document.getElementById('productsContainer').innerHTML = '<h2>No hay productos</h2>';
    }
}

socket.on('products',(products) => agregarProducto(products));

//Nuevo usuario

socket.on('user',(user) => {
    // console.log('User desde el main.js' + user);
    if (user !== false) {
        document.getElementsByTagName('h1')[0].innerHTML = `Bienvenido ${user} <input type="button" value="Deslogear" id='logOut'>`;
        document.getElementById('logOut').addEventListener('click',() => {
            window.location.assign('/logOut');
        })
    } else {
        window.location.assign('/logOut');
    }
})

setInterval(() => {
    socket.emit('new_user',async () => {
    })
},5000);

//CARRITO
socket.on('cart',(cart) => {
    //cart.productos es el array de los productos en la DB
    carrito = cart
    if (cart.productos.length > 0) {
        carritoContainer.innerHTML = ''
        cargarCarrito(carrito.productos)
    } else {
        carritoContainer.innerHTML = '<h3>No hay productos en el carrito</h3>'
    }
});

