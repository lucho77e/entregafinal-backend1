import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    thumbnails: { default: [] }
  });
  
  productSchema.plugin(mongoosePaginate);
  export const Product = model('Product', productSchema);