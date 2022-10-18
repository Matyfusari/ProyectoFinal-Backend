import Contenedor from '../../contenedores/ContenedorMongoDb.js';
import config from '../../config.js';

const contenedorMongo = new Contenedor(config.mongodb.collectionCarrito);

class CarritoDaoMongo {
    constructor(archivo) {
        this.archivo = archivo;
    }

    static _id = 0;
    static timestamp = Date.now();

    async createCarrito() {
        CarritoDaoMongo.timestamp = Date.now();
        let contenido = await contenedorMongo.getAll();
        contenido.forEach(prod => {
            if (CarritoDaoMongo._id <= prod._id) {
                CarritoDaoMongo._id++;
            }
            if (CarritoDaoMongo._id == prod._id) {
                CarritoDaoMongo._id++;
            }
        });
        let carrito = {
            _id: CarritoDaoMongo._id,
            timestamp: CarritoDaoMongo.timestamp,
            productos: []
        }
        await contenedorMongo.save(carrito);
        return CarritoDaoMongo._id;
    }

    async saveProductInCart(cart) {
        try {
            // let carritoElegido = await contenedorMongo.getById(id)
            // carritoElegido.productos.push(product);
            await contenedorMongo.updateById(cart);
        } catch (error) {
            console.log(error);
        }
        return cart;
    }

    async getById(id) {
        let carrito = await contenedorMongo.getById(id);
        return carrito;
    }

    async deleteCart(id) {
        await contenedorMongo.deleteById(id);
    }

    async deleteProdInCart(cart) {
        await contenedorMongo.updateById(cart);
        return cart;
    }

    async purchaseCart(cart) {
        await contenedorMongo.purchase(cart)
        return cart._id
    }

}

export default CarritoDaoMongo;