import config from '../config.js';
import dotenv from 'dotenv';
dotenv.config()
import { MongoClient } from 'mongodb'


import DaoProdMongo from './productos/ProductosDaoMongoDB.js'
import DaoCartMongo from './carritos/CarritoDaoMongoDB.js'

const motor = process.env.DATA_BASE;
let contenedorProdImportado;
let contenedorCarritoImportado;
let conectionMongo;
if (motor === 'mongo') {
    const mongo = new MongoClient(config.mongodb.mongo);
    await mongo.connect();
    conectionMongo = mongo;
    contenedorProdImportado = new DaoProdMongo(config.mongodb.collectionProducts)
    contenedorCarritoImportado = new DaoCartMongo(config.mongodb.collectionCarrito)
    console.log('Conectado con mongo');
}

const ContenedorProductos = contenedorProdImportado;
const ContenedorCarrito = contenedorCarritoImportado;
export { ContenedorProductos,ContenedorCarrito,conectionMongo };