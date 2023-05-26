import { Router } from "express";
import CartManager from "../classes/CartManager.class.js";

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


export default router;