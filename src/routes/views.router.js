import { Router } from "express";
import { productManager } from "../server.js";
import CartManager from "../daos/mongodb/CartManager.class.js";
import { productsModel } from "../daos/mongodb/models/products.model.js";
const router = Router();

router.get('/', async (req, res) => {

});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {style:'index.css', title:'Real Time'})
});

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page);
    let sort = req.query.sort;
    if(!page) page = 1;

    let result = await productsModel.paginate({},{page,limit:4,lean: true});
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    result.isValid = !(page<=0||page>result.totalPages);

    res.render('products', result)
});

const cartManager = new CartManager();

router.get('/carts/:cid', async (req, res) => {   
    const cart = await cartManager.getCartById(req.params.cid);
    res.render('oneCart', cart)
});

export default router