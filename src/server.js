import express from "express";
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from "socket.io";

import viewsRouter from './routes/views.router.js'
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import ProductManager from "./classes/productManager.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname+'/public'));

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