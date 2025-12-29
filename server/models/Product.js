const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    precio: { type: Number, required: true },
    imagen: String,
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Product", productSchema);