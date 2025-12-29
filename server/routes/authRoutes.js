const express = require("express");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");
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
        // Supabase Auth ya valida esto, pero podemos verificar en profiles si queremos ser explícitos
        // o dejar que supabase.auth.signUp devuelva el error.
        // Para mantener la lógica simple, intentaremos registrar directamente.
        
        /* const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Intento de registro con un email ya existente:", email);
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        } */

        // Si el rol es "admin", validar la clave especial
        if (rol === "admin" && specialKey !== ADMIN_KEY) {
            console.error("Intento de registro de admin con clave incorrecta:", specialKey);
            return res.status(403).json({ mensaje: "Clave especial incorrecta" });
        }

        const userRole = rol || "usuario"; // Si no se especifica, es usuario por defecto

        // 1. Registrar usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/login' // Asegúrate de que este sea el puerto de tu Frontend
            }
        });

        if (authError) {
            return res.status(400).json({ mensaje: authError.message });
        }

        if (authData.user) {
            // 2. Guardar datos adicionales en la tabla 'profiles'
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ id: authData.user.id, name, rol: userRole }]);

            if (profileError) {
                return res.status(400).json({ mensaje: "Error al guardar perfil: " + profileError.message });
            }
        }

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

        // 1. Iniciar sesión con Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error("Error de autenticación:", authError.message);
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // 2. Obtener el rol desde la tabla 'profiles'
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('rol')
            .eq('id', authData.user.id)
            .single();
            
        const userRole = profile ? profile.rol : "usuario";

        // Generar token con id y rol
        // Usamos el ID de Supabase Auth y el rol de la tabla profiles
        const token = jwt.sign({ id: authData.user.id, rol: userRole }, SECRET_KEY, { expiresIn: "1h" });

        console.log("Inicio de sesión exitoso para:", email, "Rol:", userRole);
        res.json({ mensaje: "Inicio de sesión exitoso", token });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

module.exports = router;
