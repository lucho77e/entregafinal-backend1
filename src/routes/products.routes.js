import { Router } from 'express';
// Importamos las funciones del controlador
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controllers.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);    
productRouter.get('/:pid', getProductById);
productRouter.post('/', createProduct);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export default productRouter;