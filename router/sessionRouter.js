import express from 'express';
const sessionRouter = express.Router();
import { conectionMongo,ContenedorCarrito } from '../daos/index.js';
import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import session from 'express-session';
import passport from '../passport.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import MongoStore from 'connect-mongo';
import config from '../config.js';
const app = express();
const cliente = twilio(process.env.TWILIO_ACCOUNT,process.env.TWILIO_TOKEN);

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongodb.mongo
    }),
    secret: 'Matias',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

let contenedor = ContenedorCarrito;

sessionRouter.get('/',async (req,res) => {
    res.render('logIn')
});

sessionRouter.post('/',passport.authenticate('login',{ failureRedirect: '/signIn',failureMessage: true }),passport.authenticate('autenticado',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    res.redirect('/formulario/' + req.body.username)
})

sessionRouter.get('/logOut',async (req,res) => {
    req.session.destroy((err) => {
        console.log(err);
        console.log('Hasta luego');
    })
    res.render('logOut')
})

sessionRouter.get('/signIn',async (req,res) => {
    res.render('signIn')
})

sessionRouter.post('/signIn',passport.authenticate('registracion',{ failureRedirect: '/',failureMessage: true }),async (req,res) => {
    let passwordHash = bcrypt.hashSync(req.body.password,10);
    let username = req.body.username;
    let name = req.body.nombre;
    let direccion = req.body.direccion;
    let edad = req.body.edad;
    let telefono = req.body.telefono;
    let idCarrito = await contenedor.createCarrito();

    //Mando mail cuando se registre el usuario
    transport.sendMail({
        from: 'Matias <matyfusa03@gmail.com>',
        to: process.env.EMAIL,
        html: `<h1>Que buen mail</h1>
        <span>Mail del usuario: ${username}</span>
        <span>Nombre del usuario: ${name}</span>
        <span>Dirección del usuario: ${direccion}</span>
        <span>Edad del usuario: ${edad}</span>
        <span>Telefono del usuario: ${telefono}</span>`,
        subject: 'Nuevo registro'
    }).then(result => {
        console.log(result);
    }).catch(err => console.log(err))

    await conectionMongo.db('users').collection('usuarios').insertOne({ username,passwordHash,name,direccion,edad,telefono,idCarrito });
    res.redirect('/formulario/' + req.body.username)
})

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

sessionRouter.get('/formulario/:username',async (req,res) => {
    const mongo = new MongoClient(config.mongodb.mongo);
    await mongo.connect();
    let username = req.params.username;
    req.session.username = username;
    req.session.request = req.session.request == null ? 1 : req.session.request + 1
    res.render('formulario')

    let userLoged = await conectionMongo.db('users').collection('usuarios').findOne({ username: username });

    socketServer.on('connection',async (socket) => {
        let carrito = await conectionMongo.db('ecommerce').collection('carrito').findOne({ _id: userLoged.idCarrito });
        socket.emit('cart',carrito)

        socket.on('addSameProd',(cart) => {
            ContenedorCarrito.saveProductInCart(cart);
        })

        socket.on('deleteProd',(cart) => {
            ContenedorCarrito.deleteProdInCart(cart);
        })


        let msg = ''
        const crearMensaje = (productos) => {
            for (const prod of productos) {
                msg += `Producto ${prod.id}: ${prod.nombre} 
                Precio: ${prod.precio}
                Cantidad: ${prod.cantidad}

                `
            }
            return msg
        }

        socket.on('purchase',async (cart) => {
            //Mando mail cuando se registre el usuario
            let mensaje = crearMensaje(cart.productos);

            transport.sendMail({
                from: 'Matias <matyfusa03@gmail.com>',
                to: process.env.EMAIL,
                html: mensaje,
                subject: `Nuevo pedido de ${username}` + mensaje
            }).then(result => {
                console.log(result);
            }).catch(err => console.log(err))

            //Mando Whatsapp
            cliente.messages.create({
                to: process.env.TWILIO_TO,
                from: process.env.TWILIO_FROM,
                body: `Nuevo pedido de ${username}
                ` + mensaje
            }).then((data) => {
                console.log('Mensaje enviado correctamente');
            }).catch(err => console.log(err));

            //Mando mensaje al usuario que compró
            cliente.messages.create({
                to: process.env.TWILIO_USERPURCHASE,
                from: process.env.TWILIO_FROMPURCHASE,
                body: 'Su pedido a sigo recibido y se encuentra en proceso'
            }).then((data) => {
                console.log('Mensaje enviado correctamente');
            }).catch(err => console.log(err));

            await conectionMongo.db('ecommerce').collection('ordenes').insertOne(cart);
        })

        socket.on('deleteCart',async (cart) => {
            ContenedorCarrito.purchaseCart(cart)
            carrito = await conectionMongo.db('ecommerce').collection('carrito').findOne({ _id: userLoged.idCarrito });
            socket.emit('cart',carrito)
        })

        socket.emit('user',username);
        let productos = [
            {
                id: 0,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 1,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 3,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 4,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
            {
                id: 5,
                nombre: faker.name.fullName(),
                precio: faker.commerce.price(),
                foto: faker.image.imageUrl()
            },
        ]
        socket.emit('products',productos)

        socket.on('new_user',async (user) => {
            let sesion = await conectionMongo.db('test').collection('sessions').find({}).toArray();
            let usuario = sesion[sesion.length - 1];
            if (usuario === undefined) {
                console.log('Sesión cerrada');
                socket.emit('user',false);
            } else {
                socket.emit('user',username);
            }
        })
    })
})

export default sessionRouter;