import express from 'express';
const carritoRouter = express.Router();
import { ContenedorCarrito } from '../daos/index.js';
// const { ContenedorCarrito } = require('../daos/index.js')
let contenedor = ContenedorCarrito;

//Creo todos los carrito que quiera con hacer un post a /carrito
carritoRouter.post('/',async (req,res) => {
    let newCarrito = await contenedor.createCarrito();
    res.send(newCarrito);
})

//Elimino el carrito que quiero haciendo /carrito/id
carritoRouter.delete('/:id',async (req,res) => {
    let id = req.params.id;
    await contenedor.deleteCart(parseInt(id));
    res.send('Carrito eliminado');
})

//Obtengo todos los productos dentro del carrito con /carrito/id/productos
carritoRouter.get('/:id/productos',async (req,res) => {
    let id = req.params.id;
    let carrito = await contenedor.getById(parseInt(id));
    res.send(carrito.productos);
})

//Ingreso un producto nuevo en el carrito con /carrito/id/productos
carritoRouter.post('/:id/productos',async (req,res) => {
    let id = req.params.id;
    let carrito = await contenedor.saveProductInCart(parseInt(id),req.body);
    res.send(carrito);
})

//Elimino el producto que se encuentro dentro de un carrito con /carrito/id/productos/id_prod
carritoRouter.delete('/:id/productos/:id_prod',async (req,res) => {
    let id = req.params.id;
    let prodId = req.params.id_prod;
    await contenedor.deleteProdInCart(parseInt(id),parseInt(prodId));
    res.send('Producto eliminado');
})


export default carritoRouter;