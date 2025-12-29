const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conexion = require("../database");
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta";
const ADMIN_KEY = process.env.ADMIN_KEY || "clave-secreta-admin"; // Clave especial para admins

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        console.log("Intento de registro para el email:", req.body.email);
        const { name, email, password, rol, specialKey } = req.body;

        // Validar que los campos no estén vacíos
        if (!name || !email || !password) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Validar si el email ya existe
        const [usuarios] = await conexion.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuarios.length > 0) {
            console.error("Intento de registro con un email ya existente:", email);
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        }

        // Si el rol es "admin", validar la clave especial
        if (rol === "admin" && specialKey !== ADMIN_KEY) {
            console.error("Intento de registro de admin con clave incorrecta:", specialKey);
            return res.status(403).json({ mensaje: "Clave especial incorrecta" });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = rol || "usuario"; // Si no se especifica, es usuario por defecto

        // Verifica que el valor de userRole se está asignando correctamente
        // console.log("Rol del usuario:", userRole);

        // Insertar usuario en la BD
        await conexion.promise().query(
            "INSERT INTO usuarios (name, email, password, rol) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, userRole]
        );

        console.log("Usuario registrado con éxito:", { email, rol: userRole });
        res.json({ mensaje: "Usuario registrado con éxito" });

    } catch (error) {
        console.error("Error en el registro de usuario:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    try {
        console.log("Intento de inicio de sesión para:", req.body.email);
        const { email, password } = req.body;

        // Verificar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
        }

        // Buscar usuario por email
        const [usuarios] = await conexion.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

        if (usuarios.length === 0) {
            console.error("Intento de inicio de sesión con email no registrado:", email);
            return res.status(401).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = usuarios[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            console.error("Intento de inicio de sesión con contraseña incorrecta para:", email);
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // Generar token con id y rol
        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET_KEY, { expiresIn: "1h" });

        console.log("Inicio de sesión exitoso para:", email, "Rol:", usuario.rol);
        res.json({ mensaje: "Inicio de sesión exitoso", token });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

module.exports = router;
