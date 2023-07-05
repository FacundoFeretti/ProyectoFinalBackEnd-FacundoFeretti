import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import { productManager } from "../../server.js";

export default class CartManager {
    connection = mongoose.connect('mongodb+srv://facundoferetti:35612799851230Pa@cluster0.knbbxtu.mongodb.net/?retryWrites=true&w=majority')
    addCart = async () => {
       const result = await cartModel.create({products: []});
       return result;
    };
 
    getCarts = async () => {
        const result = await cartModel.find({});
        return result;
    };

    getCartById = async (givenId) => {
        const result = await cartModel.findOne({_id: givenId});
        return result
    };

    addProductToCart = async (idCart, idProduct) => {
        const product = await productManager.getProductById(idProduct);
        const cart = await this.getCartById(idCart);
        cart.products.push({product: product});
        await cart.save();
        return;
    };

    deleteProductFromCart = async (cid, pid) => {
        const cart = await this.getCartById(cid);
        cart.products.pull(pid);
        await cart.save();
    };

    deleteAllProductsFromCart = async (cid) => {
        const cart = await this.getCartById(cid);
        cart.products = [];
        await cart.save();
    };

    updateProductsFromCart = async (cid, productArray) => {
        const cart = await cartModel.findOneAndUpdate(
            {_id: cid},
            {$set: {'products': productArray}},
            {new: true}
        )

        cart.save();
        return cart
    };

    updateProductsQuantity = async (pid, cid, quantity) => {
        const cart = await cartModel.findOneAndUpdate(
            {_id: cid, 'products.product': pid},
            {$set: {'products.$.quantity': quantity}},
            {new: true}
        );
        cart.save();
        return cart
        
    };
}
