import express,{ json,urlencoded } from 'express';
const app = express();
import { engine } from 'express-handlebars';
import { Server as HttpServer } from 'http';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import yargs from 'yargs'
import { cpus } from 'os';
import logger from './pino.js';
import MongoStore from 'connect-mongo';
import config from './config.js';
import productRouter from './router/productoRouter.js';
import carritoRouter from './router/carritoRouter.js';
import formRoute from './router/formRoute.js';
import logOutRoute from './router/logOutRoute.js';
import logInRoute from './router/logInRoute.js';
import signInRoute from './router/signInRoute.js';

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);
app.use(cookieParser())

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

const argumentos = process.argv.slice(2);
const parsear = yargs(argumentos).default({
    port: 0,
    modo: 'FORK'
}).alias({
    p: "port",
    m: "modo"
}).argv;

let puerto = process.env.PORT || 8080

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('views','./public/hbs_views');
app.set('view engine','hbs');

app.use('/formulario',formRoute)
app.use('/logOut',logOutRoute)
app.use('/',logInRoute)
app.use('/signIn',signInRoute)
app.use('/productos',productRouter);
app.use('/carrito',carritoRouter);


app.use((req,res,next) => {
    logger.warn('Ruta invalida')
    res.sendStatus(404)
})

const httpServer = new HttpServer(app);

// const numCPU = require("os").cpus().length
const modo = parsear.m || 'FORK'
if (modo == 'CLUSTER') {
    if (cluster.isPrimary) {
        for (let i = 0; i < cpus.length; i++) {
            cluster.fork()
        }
    } else {
        httpServer.listen(puerto,(err) => {
            console.log(`Escuchando en el puerto ${puerto}`)
            if (err) {
                logger.error('Hubo un error :' + err)
            }
        });
        httpServer.on("error",(error) => {
            console.error(error,"error de conexión")
            logger.error('Hubo un error :' + error)
        });
    }
}
if (modo == 'FORK') {
    httpServer.listen(puerto,(err) => {
        console.log(`Escuchando en el puerto ${puerto}`);
        if (err) {
            logger.error('Hubo un error :' + err)
        }
    });
    httpServer.on("error",(error) => {
        console.error(error,"error de conexión")
        logger.error('Hubo un error :' + error)
    });
}
