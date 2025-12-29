const express = require("express");
const conexion = require("../database");
const { verificarToken, verificarAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
    conexion.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            console.log("Error al obtener productos:", error); // Agregado el console log
            return res.status(500).json({ mensaje: "Error al obtener productos", error: error.message }); // Devuelve el error detallado en la respuesta
        }
        res.json(resultados);
    });
});

// Ruta para obtener un producto por ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    conexion.query("SELECT * FROM productos WHERE id = ?", [id], (error, resultados) => {
        if (error) {
            console.log("Error al obtener el producto:", error); // Agregado el console log
            return res.status(500).json({ mensaje: "Error al obtener el producto" });
        }
        if (resultados.length === 0) {
            console.log(`Producto con ID ${id} no encontrado`); // Agregado el console log
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(resultados[0]); // Devuelve el primer producto encontrado
    });
});

// Ruta para agregar un producto (requiere token y ser admin)
router.post("/", verificarToken, verificarAdmin, (req, res) => {
    const { nombre, descripcion, precio, imagen, stock } = req.body;
    conexion.query("INSERT INTO productos (nombre, descripcion, precio, imagen, stock) VALUES (?, ?, ?, ?, ?)", 
        [nombre, descripcion, precio, imagen, stock], (error) => {
        if (error) {
            console.log("Error al agregar producto:", error); // Agregado el console log
            return res.status(400).json({ mensaje: "Error al agregar producto" });
        }
        res.json({ mensaje: "Producto agregado" });
    });
});

// Ruta para editar un producto (requiere token y ser admin)
router.put("/:id", verificarToken, verificarAdmin, (req, res) => {
    const { nombre, descripcion, precio, imagen, stock } = req.body;
    const { id } = req.params;
    conexion.query("UPDATE productos SET nombre=?, descripcion=?, precio=?, imagen=?, stock=? WHERE id=?", 
        [nombre, descripcion, precio, imagen, stock, id], (error) => {
        if (error) {
            console.log("Error al actualizar producto:", error); // Agregado el console log
            return res.status(400).json({ mensaje: "Error al actualizar producto" });
        }
        res.json({ mensaje: "Producto actualizado" });
    });
});

// Ruta para eliminar un producto (requiere token y ser admin)
router.delete("/:id", verificarToken, verificarAdmin, (req, res) => {
    const { id } = req.params;
    conexion.query("DELETE FROM productos WHERE id=?", [id], (error) => {
        if (error) {
            console.log("Error al eliminar producto:", error); // Agregado el console log
            return res.status(400).json({ mensaje: "Error al eliminar producto" });
        }
        res.json({ mensaje: "Producto eliminado" });
    });
});

module.exports = router;


