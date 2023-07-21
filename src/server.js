import express from "express";
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js'
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import sessionsRouter from './routes/sessions.router.js'

import { Server } from "socket.io";
import ProductManager from "./daos/mongodb/productManager.js";

//Initial configuration
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://facundoferetti:35612799851230Pa@cluster0.knbbxtu.mongodb.net/?retryWrites=true&w=majority',
        ttl: 1800
    }),
    secret: 'mongoSecret',
    resave: true,
    saveUninitialized: true
}));

///Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Static
app.use(express.static(__dirname+'/public'));

//Routers
app.use('/', viewsRouter);
app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts)
app.use('/api/sessions', sessionsRouter)

const httpServer = app.listen(8080, () => console.log("Servidor Levantado"));
const socketServer = new Server(httpServer)

export const productManager = new ProductManager();
const products = await productManager.getProducts();

socketServer.on('connection', socket => {
    console.log('new user '+ socket.id)
    socketServer.emit('sendUsers', products)
});

export default socketServer;