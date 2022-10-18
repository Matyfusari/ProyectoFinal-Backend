import express from 'express';
const productRouter = express.Router();
import { ContenedorProductos } from '../daos/index.js'
let contenedor = ContenedorProductos;


const middlewareAutenticacion = (req,res,next) => {
    req.user = {
        fullName: "Matias Aguilera",
        isAdmin: true
    };
    next();
}
const middlewareAutorizacion = (req,res,next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("No estas autorizado");
    }
}

// Obtener todos los productos
productRouter.get('/',middlewareAutenticacion,async (req,res) => {
    let allProducts = await contenedor.getAll();
    res.send(allProducts);
})

// Obtener 1 producto
productRouter.get('/:id',middlewareAutenticacion,async (req,res) => {
    let prodSelected = await contenedor.getById(parseInt(req.params.id));

    if (prodSelected) {
        res.send(prodSelected);
    } else {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

//Creo un producto
productRouter.post('/',middlewareAutenticacion,middlewareAutorizacion,async (req,res,next) => {
    let prod = await contenedor.save(req.body);
    if (prod.nombre === '' || prod.precio === '' || prod.foto === '' || prod.foto === '' || prod.stock === '' || prod.descripcion === '') {
        res.status(400).send({ error: 'El producto no se pudo cargar, hay campos vacios' });
    } else {
        res.send(req.body);
    }
    next();
})

//Actualizo un producto
productRouter.put('/:id',middlewareAutenticacion,middlewareAutorizacion,(req,res) => {
    contenedor.updateById(parseInt(req.params.id),req.body);
    res.send(req.body);
})

//Elimino un producto
productRouter.delete('/:id',middlewareAutenticacion,middlewareAutorizacion,async (req,res) => {
    let prodDeleted = await contenedor.deleteById(parseInt(req.params.id));
    res.send(prodDeleted);
})

export default productRouter;