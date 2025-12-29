const express = require("express");
const supabase = require("../supabase");
const { verificarToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Ruta para agregar productos al carrito
router.post("/carrito", verificarToken, async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.usuario.id;

    try {
        // Verificar si el producto ya está en el carrito
        const { data: itemCarrito } = await supabase
            .from('carts')
            .select('*')
            .eq('usuario_id', usuario_id)
            .eq('producto_id', producto_id)
            .single();

        if (itemCarrito) {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            await supabase
                .from('carts')
                .update({ cantidad: itemCarrito.cantidad + parseInt(cantidad) })
                .eq('id', itemCarrito.id);
        } else {
            // Si el producto no está, lo agregamos al carrito
            await supabase
                .from('carts')
                .insert([{ usuario_id, producto_id, cantidad }]);
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
        // En Supabase usamos joins para traer datos relacionados
        const { data: items, error } = await supabase
            .from('carts')
            .select('*, products(*)')
            .eq('usuario_id', usuario_id);
        
        // Formateamos la respuesta para que coincida con lo que espera el frontend
        const carrito = items.map(item => ({
            id: item.products.id, // Supabase devuelve el objeto relacionado en la propiedad 'products'
            nombre: item.products.nombre,
            precio: item.products.precio,
            cantidad: item.cantidad,
            imagen: item.products.imagen
        }));

        res.json({ carrito });
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
        await supabase
            .from('carts')
            .delete()
            .match({ usuario_id, producto_id }); // match es útil para borrar por múltiples campos
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
        const { data: productos } = await supabase
            .from('carts')
            .select('*, products(*)')
            .eq('usuario_id', usuario_id);

        if (productos.length === 0) {
            return res.status(400).json({ mensaje: "El carrito está vacío" });
        }

        // Calcular total del pedido
        let total = 0;
        for (let item of productos) {
            total += item.products.precio * item.cantidad;
        }

        // Crear el pedido
        const { data: pedido, error: pedidoError } = await supabase
            .from('orders')
            .insert([{ usuario_id, total }])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        // Insertar detalles del pedido
        const detalles = productos.map(item => ({
            pedido_id: pedido.id,
            producto_id: item.products.id,
            cantidad: item.cantidad,
            subtotal: item.cantidad * item.products.precio
        }));

        await supabase.from('order_details').insert(detalles);

        // Eliminar productos del carrito después de hacer el pedido
        await supabase.from('carts').delete().eq('usuario_id', usuario_id);

        res.json({ mensaje: "Pedido realizado", pedido_id: pedido.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al procesar el pedido" });
    }
});

module.exports = router;