const express = require("express");
const supabase = require("../supabase");
const { verificarToken, verificarAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const { data: productos, error } = await supabase.from('products').select('*');
        if (error) throw error;
        // Mapeamos id a _id para compatibilidad con frontend si es necesario, o el frontend debe usar id
        res.json(productos.map(p => ({ ...p, _id: p.id })));
    } catch (error) {
        console.log("Error al obtener productos:", error);
        res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
    }
});

// Ruta para obtener un producto por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { data: producto, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (!producto) {
            console.log(`Producto con ID ${id} no encontrado`);
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ ...producto, _id: producto.id });
    } catch (error) {
        console.log("Error al obtener el producto:", error);
        res.status(500).json({ mensaje: "Error al obtener el producto" });
    }
});

// Ruta para agregar un producto (requiere token y ser admin)
router.post("/", verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, stock } = req.body;
        const { error } = await supabase
            .from('products')
            .insert([{ nombre, descripcion, precio, imagen, stock }]);
        if (error) throw error;
        res.json({ mensaje: "Producto agregado" });
    } catch (error) {
        console.log("Error al agregar producto:", error);
        res.status(400).json({ mensaje: "Error al agregar producto" });
    }
});

// Ruta para editar un producto (requiere token y ser admin)
router.put("/:id", verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, stock } = req.body;
        const { id } = req.params;
        const { error } = await supabase
            .from('products')
            .update({ nombre, descripcion, precio, imagen, stock })
            .eq('id', id);
        if (error) throw error;
        res.json({ mensaje: "Producto actualizado" });
    } catch (error) {
        console.log("Error al actualizar producto:", error);
        res.status(400).json({ mensaje: "Error al actualizar producto" });
    }
});

// Ruta para eliminar un producto (requiere token y ser admin)
router.delete("/:id", verificarToken, verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        console.log("Error al eliminar producto:", error);
        res.status(400).json({ mensaje: "Error al eliminar producto" });
    }
});

module.exports = router;
