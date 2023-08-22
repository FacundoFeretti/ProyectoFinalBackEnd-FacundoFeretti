import { Router } from "express";
import { productManager } from "../server.js";
import CartManager from "../daos/mongodb/CartManager.class.js";
import { productsModel } from "../daos/mongodb/models/products.model.js";
import passport from "passport";
const router = Router();

router.get('/', async (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {style:'index.css', title:'Real Time'})
});

router.get('/products', passport.authenticate('jwt', {session: false}),async (req, res) => {
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    let user = req.user
    if(!page) page = 1;

    let result = await productsModel.paginate({},{page,limit:4,lean: true});
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    result.isValid = !(page<=0||page>result.totalPages);

    const obj = {user: user, result: result}

    // res.send({obj})
    res.render('products', obj)
});

const cartManager = new CartManager();

router.get('/carts/:cid', async (req, res) => {   
    const cart = await cartManager.getCartById(req.params.cid);
    res.render('oneCart', cart)
});

export default router