import express from "express";
import handlebars from 'express-handlebars';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js'
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";

import { Server } from "socket.io";
import ProductManager from "./daos/mongodb/productManager.js";

//Initial configuration
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

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

const httpServer = app.listen(8080, () => console.log("Servidor Levantado"));
const socketServer = new Server(httpServer)

export const productManager = new ProductManager();
const products = await productManager.getProducts();

socketServer.on('connection', socket => {
    console.log('new user '+ socket.id)
    socketServer.emit('sendUsers', products)
});

export default socketServer;