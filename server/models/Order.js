const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
    detalles: [{
        producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        cantidad: Number,
        subtotal: Number
    }]
});

module.exports = mongoose.model("Order", orderSchema);