import { Product } from '../models/product.model.js';

// GET: listar productos (con limit opcional) y renderizar vista
export const getAllProducts = async (req, res) => {
    try {
      // 1. Extraemos los query params y seteamos defaults
      let { limit = 10, page = 1, sort, query } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
  
      // 2. Armamos el filtro (por categoría o status)
      const filter = {};
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else if (query) {
        filter.category = query;
      }
  
      // 3. Armamos la opción de orden
      let sortOption = {};
      if (sort === 'asc') {
        sortOption.price = 1;
      } else if (sort === 'desc') {
        sortOption.price = -1;
      }
  
      // 4. Configuramos las opciones para paginate
      const options = {
        page,            // página
        limit,           // elementos por página
        sort: sortOption,
        lean: true       // para que devuelva objetos planos 
      };
  
      // 5. Llamamos a paginate (mongoose-paginate-v2)
      const result = await Product.paginate(filter, options);
  
      // 6. Devolvemos el resultado tal cual
      // Esto incluirá: docs, totalDocs, limit, totalPages, page, 
      // hasNextPage, hasPrevPage, nextPage, prevPage, etc.
      res.status(200).render('templates/home', { 
        productos: result.docs,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  };

// GET: obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const producto = await Product.findById(idProducto);

    if (producto) {
      // Respuesta
      res.status(200).render('templates/productDetails', { producto });
    } else {
      res.status(404).send({ mensaje: 'El producto no existe' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Hubo un error al buscar el producto' });
  }
};

// POST: crear un producto
export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    // Creamos en Mongo
    const newProduct = await Product.create({
      title,
      description,
      code,
      price,
      stock,
      status: true,
      category,
      thumbnails: []
    });

    // Respuesta
    res.status(201).send({ mensaje: `Producto creado con el id ${newProduct._id}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Hubo un error al crear el producto' });
  }
};

// PUT: actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const { title, description, code, price, stock, status, category, thumbnails } = req.body;

    // Usamos findByIdAndUpdate para actualizar en la DB
    const updatedProduct = await Product.findByIdAndUpdate(
      idProducto,
      { title, description, code, price, stock, status, category, thumbnails },
      { new: true } // para que retorne el doc actualizado
    );

    if (updatedProduct) {
      res.status(200).send({ mensaje: `Producto con el id ${idProducto} fue modificado` });
    } else {
      res.status(404).send({ mensaje: 'El producto no existe' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al actualizar el producto' });
  }
};

// DELETE: eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const idProducto = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(idProducto);

    if (deletedProduct) {
      res.status(200).send({ mensaje: 'Producto eliminado' });
    } else {
      res.status(404).send({ mensaje: 'El producto no existe' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al eliminar el producto' });
  }
};