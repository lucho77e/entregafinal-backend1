import express from 'express';
import { create } from 'express-handlebars'

import productRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './path.js';
import path from 'path';
import { log } from 'console';
import mongoose from 'mongoose';

const app = express();
const hbs = create({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }
  });
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Servidor arriba, en el puerto " + PORT));

await mongoose.connect("mongodb+srv://lucianomarotte:BHDnnJYYvS4ycNRN@clustercoder.l6j9m.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCoder")
  .then(() => {
    console.log('Conectado a MongoDB Atlas!');
  })
  .catch(error => {
    console.error('Error de conexión:', error);
  });



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/static', express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'))

app.use('/api/products/', productRouter)
app.use('/api/carts/', cartsRouter)



