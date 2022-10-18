import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import config from './config.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb'
import express from 'express';
const app = express();


app.use(cookieParser())

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://matias:351426351@cluster0.6lyvpyc.mongodb.net/?retryWrites=true&w=majority'
    }),
    secret: 'Matias',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000
    }
}))

const mongo = new MongoClient(config.mongodb.mongo);
(async () => {
    await mongo.connect();
})();
let conectionMongo = mongo


passport.use('registracion',new LocalStrategy(async (username,password,callback) => {
    console.log(`Linea algo ${username} ${password}`);
    let users = await conectionMongo.db('users').collection('usuarios').find({}).toArray();
    let user = users.find(usuario => usuario.username === username);
    if (user) {
        return callback(null,false,{ message: 'El usuario ya existe' });
    }
    else if (user === undefined) {
        return callback(null,username)
    }

    // callback(null,usuarioCreado);
}))

passport.use('login',new LocalStrategy(async (username,password,callback) => {
    let users = await conectionMongo.db('users').collection('usuarios').find({}).toArray();
    let user = users.find(usuario => usuario.username === username);
    if (!user) {
        return callback(null,false,{ message: 'El usuario no existe' });
    }
    callback(null,username);
}))

passport.use('autenticado',new LocalStrategy(async (username,password,callback) => {
    let users = await conectionMongo.db('users').collection('usuarios').find({}).toArray();
    const user = users.find(usuario => usuario.username === username);
    if (!user || !bcrypt.compareSync(password,user.passwordHash)) return callback(null,false,{ message: 'Usuario ya creado' })
    callback(null,username)
}));

passport.serializeUser((usuario,callback) => {
    callback(null,true)
})

passport.deserializeUser((username,callback) => {
    console.log('Username desde deserializer: ' + username);
    callback(null,username)
})

export default passport;