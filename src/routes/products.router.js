import { Router } from "express";
import { productManager } from "../server.js";
import socketServer from "../server.js";

const router = Router();


router.get('/', async (req, res) => {
   let limitCondition = req.query.limit;
   
   let limit = limitCondition ? Number(limitCondition) : 10
   let page = Number(req.query.page);
   let sort = Number(req.query.sort);
   let filter = req.query.filter;
   let filterValue = req.query.filtervalue;

   let products = await productManager.getProducts(limit, page, sort, filter, filterValue)

    res.send({products})
})

router.get("/:id", async(req, res) => {
    const producto = await productManager.getProductById(req.params.id)
    res.send(producto);
})

router.post("/", async (req, res) => {
    const user = req.body;
    try{
        const newProduct = await productManager.addProduct(
    user
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