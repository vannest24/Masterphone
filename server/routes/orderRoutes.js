const express = require("express");
const conexion = require("../database");
const { verificarToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Ruta para agregar productos al carrito
router.post("/carrito", verificarToken, async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.usuario.id;

    try {
        // Verificar si el producto ya está en el carrito
        const [productoEnCarrito] = await conexion.query(
            "SELECT * FROM carritos WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );

        if (productoEnCarrito.length > 0) {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            await conexion.query(
                "UPDATE carritos SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?",
                [cantidad, usuario_id, producto_id]
            );
        } else {
            // Si el producto no está, lo agregamos al carrito
            await conexion.query(
                "INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
                [usuario_id, producto_id, cantidad]
            );
        }

        res.json({ mensaje: "Producto agregado al carrito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al agregar el producto al carrito" });
    }
});

// Ruta para obtener los productos del carrito del usuario autenticado
router.get("/carrito", verificarToken, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        const [productosEnCarrito] = await conexion.query(
            "SELECT productos.id, productos.nombre, productos.precio, carritos.cantidad FROM carritos INNER JOIN productos ON carritos.producto_id = productos.id WHERE carritos.usuario_id = ?",
            [usuario_id]
        );

        res.json({ carrito: productosEnCarrito });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener el carrito" });
    }
});

// Ruta para eliminar un producto del carrito
router.delete("/carrito/:producto_id", verificarToken, async (req, res) => {
    const { producto_id } = req.params;
    const usuario_id = req.usuario.id;

    try {
        await conexion.query(
            "DELETE FROM carritos WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );
        res.json({ mensaje: "Producto eliminado del carrito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el producto del carrito" });
    }
});

// Crear un pedido
router.post("/pedido", verificarToken, async (req, res) => {
    const usuario_id = req.usuario.id;

    try {
        // Obtener los productos del carrito del usuario
        const [productos] = await conexion.query(
            "SELECT carritos.producto_id, carritos.cantidad, productos.precio FROM carritos INNER JOIN productos ON carritos.producto_id = productos.id WHERE carritos.usuario_id = ?",
            [usuario_id]
        );

        if (productos.length === 0) {
            return res.status(400).json({ mensaje: "El carrito está vacío" });
        }

        // Calcular total del pedido
        let total = 0;
        for (let item of productos) {
            total += item.precio * item.cantidad;
        }

        // Insertar el pedido
        const [pedidoResultado] = await conexion.query(
            "INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)",
            [usuario_id, total]
        );
        const pedido_id = pedidoResultado.insertId;

        // Insertar los detalles del pedido
        for (let item of productos) {
            const subtotal = item.cantidad * item.precio;

            await conexion.query(
                "INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)",
                [pedido_id, item.producto_id, item.cantidad, subtotal]
            );
        }

        // Eliminar productos del carrito después de hacer el pedido
        await conexion.query("DELETE FROM carritos WHERE usuario_id = ?", [usuario_id]);

        res.json({ mensaje: "Pedido realizado", pedido_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al procesar el pedido" });
    }
});

module.exports = router;