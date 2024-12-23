import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

// GET: obtener carrito por ID (con populate)
export const getCartById = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const carrito = await Cart.findById(idCarrito).populate('products.product');
    if (carrito) {
      // Se renderiza en una vista:
      res.status(200).render('templates/cartDetails', { cart: carrito });
    } else {
      res.status(404).send({ mensaje: 'El carrito no existe' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al obtener el carrito' });
  }
};

// POST: crear carrito
export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    return res.status(201).send({ mensaje: `Carrito creado con el id ${newCart._id}` });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al crear el carrito' });
  }
};

// PUT o POST: agregar/actualizar un producto puntual en el carrito
export const updateProductInCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;
    const { quantity } = req.body;

    // Verificar existencia del carrito
    const cart = await Cart.findById(idCarrito);
    if (!cart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    // Verificar existencia del producto
    const product = await Product.findById(idProducto);
    if (!product) {
      return res.status(404).send({ mensaje: 'El producto no existe' });
    }

    // Chequear si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(
      p => p.product.toString() === idProducto
    );

    if (productIndex !== -1) {
      // Si el producto ya estaba, usamos findOneAndUpdate con $set
      await Cart.findOneAndUpdate(
        { _id: idCarrito, 'products.product': idProducto },
        { $set: { 'products.$.quantity': quantity } }
      );
    } else {
      // Si no estaba, lo agregamos con $push
      await Cart.findByIdAndUpdate(
        idCarrito,
        { $push: { products: { product: idProducto, quantity } } }
      );
    }

    return res.status(200).send({ mensaje: 'Carrito actualizado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al actualizar el carrito' });
  }
};

// PUT: reemplazar TODO el arreglo de productos
export const updateCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const { products } = req.body; // array de { product, quantity }

    const updatedCart = await Cart.findByIdAndUpdate(
      idCarrito,
      { products },       // Reemplaza el array entero
      { new: true }       // Retorna el doc actualizado
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: `Carrito con id ${idCarrito} fue modificado` });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al actualizar el carrito' });
  }
};

// DELETE: eliminar UN producto específico
export const removeProductFromCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;

    // Con $pull removemos el objeto cuyo product == idProducto
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: idCarrito },
      { $pull: { products: { product: idProducto } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al eliminar el producto del carrito' });
  }
};

// DELETE: eliminar TODOS los productos
export const clearCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;

    // Reseteamos el array de productos a []
    const updatedCart = await Cart.findByIdAndUpdate(
      idCarrito,
      { $set: { products: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: 'Carrito vaciado completamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al vaciar el carrito' });
  }
};