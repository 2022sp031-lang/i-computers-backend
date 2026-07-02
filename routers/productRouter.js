import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct)
productRouter.get('/', getAllProducts)
productRouter.delete('/:productId', deleteProduct)
productRouter.put('/:productId', updateProduct)
productRouter.get('/:productId', getProduct)

export default productRouter