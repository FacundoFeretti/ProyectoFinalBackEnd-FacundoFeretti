import { Router } from "express";
import { productManager } from "../server.js";
const router = Router();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', {style:'index.css', title:'Products', products})
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {style:'index.css', title:'Real Time'})
});

export default router