import { conectionMongo } from '../daos/index.js'

class Contenedor {
    constructor(collection) {
        this.collection = collection;
    }

    async save(datos) {
        try {
            await conectionMongo.db('ecommerce').collection(this.collection).insertOne(datos);
        } catch (error) {
            console.log(error);
        }
        return datos;
    }


    async getById(id) {
        let producto = await conectionMongo.db('ecommerce').collection(this.collection).findOne({ _id: id });
        if (producto) {
            console.log('Existe!');
        } else {
            console.log('No existe');
        }
        return producto;
    }

    async getAll() {
        let contenido = await conectionMongo.db('ecommerce').collection(this.collection).find({}).toArray();
        return contenido;
    }

    async deleteById(id) {
        await conectionMongo.db('ecommerce').collection(this.collection).deleteOne({ _id: id });
        console.log('se ha Eliminado');
    }

    async updateById(productoActualizado) {
        await conectionMongo.db('ecommerce').collection(this.collection).updateOne({ _id: productoActualizado._id },{ $set: productoActualizado });
        return productoActualizado;
    }

    async purchase(cart) {
        cart.productos = []
        await conectionMongo.db('ecommerce').collection(this.collection).updateOne({ _id: cart._id },{ $set: cart });
        return cart._id
    }
}

export default Contenedor;