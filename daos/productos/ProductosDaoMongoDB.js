import Contenedor from '../../contenedores/ContenedorMongoDb.js'
import config from '../../config.js'

const contenedorMongo = new Contenedor(config.mongodb.collectionProducts);


class ProductosDaoMongo {
    constructor(archivo) {
        this.archivo = archivo;
    }

    static _id = 0;
    static timestamp = Date.now();
    static codigo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    async save(producto) {
        try {
            let contenido = await contenedorMongo.getAll()
            if (contenido.length === 0) {
                console.log('No hay datos');
                if (producto.nombre == '' || producto.precio == '' || producto.foto == '' || producto.foto == undefined || producto.stock == '' || producto.descipcion == '') {
                    console.log('No se puede guardar el producto');
                } else {
                    producto._id = ProductosDaoMongo._id;
                    producto.timestamp = ProductosDaoMongo.timestamp;
                    producto.codigo = ProductosDaoMongo.codigo;
                    await contenedorMongo.save(producto);
                    ProductosDaoMongo._id++;
                    ProductosDaoMongo.timestamp = Date.now();
                    ProductosDaoMongo.codigo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                }
            } else {
                contenido.forEach(prod => {
                    if (ProductosDaoMongo._id <= prod._id) {
                        ProductosDaoMongo._id++;
                    }
                    if (ProductosDaoMongo._id == prod._id) {
                        ProductosDaoMongo._id++;
                    }
                });
                for (let i = 0; i < contenido.length; i++) {
                    if (contenido[i].nombre === producto.nombre || contenido[i].foto === producto.foto) {
                        console.log('El producto ya existe');
                    } else if (producto.nombre == '' || producto.precio == '' || producto.foto == '' || producto.foto == undefined || producto.stock == '' || producto.descipcion == '') {
                        console.log('No se pudo cargar el producto, hay campos vacíos');
                    } else {
                        console.log(ProductosDaoMongo._id);
                        producto._id = ProductosDaoMongo._id;
                        producto.timestamp = ProductosDaoMongo.timestamp;
                        producto.codigo = ProductosDaoMongo.codigo;
                        await contenedorMongo.save(producto);
                    }
                }
                ProductosDaoMongo._id++;
                ProductosDaoMongo.timestamp = Date.now();
                ProductosDaoMongo.codigo = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            }

        } catch (error) {
            console.log(error);
        }
        return producto;
    }


    async getById(id) {
        let producto = await contenedorMongo.getById(id);
        return producto;
    }

    async getAll() {
        let productos = await contenedorMongo.getAll()
        return productos;
    }

    async deleteById(id) {
        await contenedorMongo.deleteById(id)
    }

    async updateById(id,producto) {
        let productoDb = await contenedorMongo.getById(id);
        console.log('pasé');
        productoDb.nombre = producto.nombre === '' || producto.nombre === undefined ? prod.nombre : producto.nombre;
        productoDb.precio = producto.precio === '' || producto.precio === undefined ? prod.precio : producto.precio;
        productoDb.foto = producto.foto === '' || producto.foto === undefined ? prod.foto : producto.foto;
        productoDb.stock = producto.stock === '' || producto.stock === undefined ? prod.stock : producto.stock;
        productoDb.descripcion = producto.descripcion === '' || producto.descripcion === undefined ? prod.descripcion : producto.descripcion;

        await contenedorMongo.updateById(productoDb)
    }
}
export default ProductosDaoMongo;