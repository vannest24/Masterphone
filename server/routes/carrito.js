const express = require("express");
const conexion = require("../database");
const { verificarToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// Agregar producto al carrito
router.post("/agregar", verificarToken, (req, res) => {
    const { id_producto, nombre, precio, imagen } = req.body;
    const id_usuario = req.usuario.id; // Usamos el id del usuario que está logueado

    console.log("Datos recibidos para agregar al carrito:", req.body); // Ver los datos recibidos

    // Verificamos si el producto ya está en el carrito
    conexion.query(
        "SELECT * FROM carrito WHERE id_usuario = ? AND id_producto = ?",
        [id_usuario, id_producto],
        (error, resultados) => {
            if (error) {
                console.error("Error al verificar carrito:", error);
                return res.status(500).json({ mensaje: "Error al verificar carrito", error });
            }

            if (resultados.length > 0) {
                // Si el producto ya está en el carrito, actualizamos la cantidad
                console.log(`Producto ya existe en el carrito. Actualizando la cantidad de producto con ID: ${id_producto}`);
                conexion.query(
                    "UPDATE carrito SET cantidad = cantidad + 1 WHERE id_usuario = ? AND id_producto = ?",
                    [id_usuario, id_producto],
                    (error) => {
                        if (error) {
                            console.error("Error al actualizar carrito:", error);
                            return res.status(500).json({ mensaje: "Error al actualizar carrito", error });
                        }
                        console.log("Cantidad del producto actualizada con éxito.");
                        res.json({ mensaje: "Producto agregado al carrito" });
                    }
                );
            } else {
                // Si el producto no está en el carrito, lo insertamos
                console.log(`Producto no existe en el carrito. Agregando producto con ID: ${id_producto}`);
                conexion.query(
                    "INSERT INTO carrito (id_usuario, id_producto, nombre, precio, imagen, cantidad) VALUES (?, ?, ?, ?, ?, ?)",
                    [id_usuario, id_producto, nombre, precio, imagen, 1],
                    (error) => {
                        if (error) {
                            console.error("Error al agregar producto al carrito:", error);
                            return res.status(500).json({ mensaje: "Error al agregar producto al carrito", error });
                        }
                        console.log("Producto agregado al carrito con éxito.");
                        res.json({ mensaje: "Producto agregado al carrito" });
                    }
                );
            }
        }
    );
});

// Obtener productos del carrito
router.get("/", verificarToken, (req, res) => {
    const id_usuario = req.usuario.id;

    console.log(`Obteniendo productos del carrito para el usuario con ID: ${id_usuario}`);
    
    conexion.query(
        "SELECT * FROM carrito WHERE id_usuario = ?",
        [id_usuario],
        (error, resultados) => {
            if (error) {
                console.error("Error al obtener carrito:", error);
                return res.status(500).json({ mensaje: "Error al obtener carrito", error });
            }
            
            if (resultados.length === 0) {
                console.log("El carrito está vacío para el usuario con ID:", id_usuario);
            } else {
                console.log(`Productos del carrito obtenidos con éxito para el usuario con ID: ${id_usuario}`);
            }

            res.json(resultados);
        }
    );
});

module.exports = router;


