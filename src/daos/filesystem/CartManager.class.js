import fs from "fs";
import { v4 as uuidV4 } from "uuid";

const path = "./src/classes/files/carts.json";

export default class CartManager {

    addCart = async () => {
        const carts = await this.getCarts();
        carts.push({id: uuidV4(), products: [] })
        await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"))
    };
 
    getCarts = async () => {
        if(fs.existsSync(path)){
            const data = await fs.promises.readFile(path, "utf-8")
            const carts = JSON.parse(data);
            return carts; 
        } else {
            throw new Error("No hay carritos para mostrar")
        }
    };

    getCartById = async (givenId) => {
        const carts = await this.getCarts();
        const findCart = carts.find(e => e.id == givenId);

        if(findCart){
            return findCart;
        } else {
            throw new Error("No se encontro un carrito con ese id")
        }
    };

    addProductToCart = async (idCart, idProduct) => {
        const cart = await this.getCartById(idCart);

        const productIndex = cart.products.findIndex(e => e.id == idProduct)

        if(productIndex == -1){
            cart.products.push({id: idProduct, quantity: 1})
        } else {
            cart.products[productIndex].quantity++
        }
        
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(e => e.id == idCart)

        carts[cartIndex] = cart;
        await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))

    };
}
