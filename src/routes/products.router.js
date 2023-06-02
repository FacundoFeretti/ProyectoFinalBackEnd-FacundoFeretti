import { Router } from "express";
import { productManager } from "../server.js";
import socketServer from "../server.js";

const router = Router();


router.get('/', async (req, res) => {
    const {limit} = req.query;
    if(limit){
        const products = await productManager.getProducts();
        const filtrado = await products.slice(0, limit);
        res.send(filtrado) 
    } else {
        const productos = await productManager.getProducts();
        res.send(productos)
    }
})

router.get("/:id", async(req, res) => {
    const producto = await productManager.getProductById(req.params.id)
    res.send(producto);
})

router.post("/", async (req, res) => {
    const user = req.body;
    try{
        const newProduct = await productManager.addProduct(
            user.title,
            user.description,
            user.price,
            user.code,
            user.stock,
            user.category,
            user.thumbnails,
            user.status
        );
        socketServer.emit('newProduct', newProduct);
        res.status(200).send({status: "success"});
    } catch(er) {
        res.status(500).send({ error: er.message});
    }
});

router.put("/:id", async (req, res) => {
        try{
            const product = await productManager.updateProduct(req.params.id, req.body)
            socketServer.emit('updateProduct', product)
            res.status(200).send({status: "success"})
        } catch(e) {
            res.status(500).send({ error: e.message})
        }

});

router.delete("/:id" , async (req, res) => {
    try{
        await productManager.deleteProduct(req.params.id)
        socketServer.emit('deleteProduct', req.params.id)
        res.status(200).send({status: "success"})
    } catch(e) {
        res.status(500).send({ error: e.message})
    }
});

export default router;