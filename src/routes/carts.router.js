import { Router } from "express";
import CartManager from "../daos/mongodb/CartManager.class.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:id", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.id);
    res.send(cart);
});

router.get('/', async( req, res ) => {
    const carts = await cartManager.getCarts();
    res.send(carts);
});

router.post('/', async (req, res) => {
    await cartManager.addCart();
    res.send({status: 'success'})
});

router.post('/:cid/product/:pid', async (req, res) => {
    await cartManager.addProductToCart(req.params.cid, req.params.pid)
    res.send({status: 'success'})
});

router.delete('/:cid/product/:pid', async (req, res) => {
    cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
    res.send({status: 'success'})
});

router.delete('/:cid', async (req, res) => {
    cartManager.deleteAllProductsFromCart(req.params.cid);
    res.send({status: 'success'})
});

router.put('/:cid', async (req,res) => {
    cartManager.updateProductsFromCart(req.params.cid, req.body);
    res.send({status: 'success'})
});

router.put('/:cid/product/:pid', async (req, res) =>{
    await cartManager.updateProductsQuantity(req.params.pid, req.params.cid, req.body.quantity)
    res.send({status: 'success'})
});
export default router;