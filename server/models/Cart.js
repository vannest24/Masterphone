const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    cantidad: { type: Number, default: 1 }
});

module.exports = mongoose.model("Cart", cartSchema);