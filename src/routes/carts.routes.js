import { Router } from 'express';
import {
  createCart,
  getCartById,
  updateProductInCart,
  updateCart,
  removeProductFromCart,
  clearCart
} from '../controllers/carts.controllers.js';

const cartsRouter = Router();

cartsRouter.get('/:cid', getCartById);
cartsRouter.post('/', createCart);
cartsRouter.put('/:cid/products/:pid', updateProductInCart);
cartsRouter.put('/:cid', updateCart);
cartsRouter.delete('/:cid/products/:pid', removeProductFromCart);
cartsRouter.delete('/:cid', clearCart);

export default cartsRouter;