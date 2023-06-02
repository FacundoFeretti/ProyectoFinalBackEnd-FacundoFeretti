import fs from "fs"
import { v4 as uuidV4 } from "uuid"

export default class ProductManager{
    constructor(){
        this.path = "./src/classes/files/products.json"
    }

    getProductById = async (givenId) => {
        
        const products = await this.getProducts();
        
        const findProduct = products.find(e => e.id == givenId);
        
        if(findProduct){
            console.log(findProduct)
            return findProduct
        } else {     
            console.log("Not Found")
            return ["No se encontro producto"]
        }
    }
    addProduct = async (title, description, price, code, stock, category, thumbnails, status = true) => {
        
        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error('Todos los argumentos son obligatorios');
        }

        const products = await this.getProducts();
        
        const product = {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            status,
            category,
            id: uuidV4()
        }

        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
    
        return product;
    }
    

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8")
            const products = JSON.parse(data);
            return products;
        } else {
            return []
        }
    }

    
    updateProduct = async (givenId, updatedObject) => {
        // Se requiere pasar un objeto con las key que se desea actualizar.
        const products = await this.getProducts();
        
        const productIndex = products.findIndex(e => e.id == givenId);

        if(productIndex !== -1){
            
            const existingProduct = products[productIndex];
            const hasMatchingKeys = Object.keys(updatedObject).some(e => existingProduct.hasOwnProperty(e))

            if(!hasMatchingKeys){
                throw new Error("El producto que intentas actualizar no tiene una o mas propiedades que se intentan actualizar")
            };

            const updatedProduct = {
               ...products[productIndex],
               ...updatedObject,
               id: givenId
            }

            products[productIndex] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            return updatedProduct;
        } else {
            console.log(`El producto con el id: ${givenId} no fue encontrado`)
        };
    }

    deleteProduct = async (givenId) => {
        
        const products = await this.getProducts();        
        
        const productToDelete = await products.indexOf(products.find(e => e.id == givenId))

        if(productToDelete > -1){
            products.splice(productToDelete, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            console.log("Product deleted")
        } else {
            throw new Error("There is no product with that ID")
            console.log("There is no product with that ID")
        }  
    }
}