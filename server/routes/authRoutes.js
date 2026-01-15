const express = require("express");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || "clave-secreta";
const ADMIN_KEY = process.env.ADMIN_KEY || "clave-secreta-admin"; // Clave especial para admins

// Configuración para evitar fuerza bruta (Rate Limiting en memoria)
const loginAttempts = {}; // Almacena intentos: { "email": { attempts: 0, lockUntil: timestamp, blockCount: 0 } }
const MAX_ATTEMPTS = 3;   // Número máximo de intentos fallidos permitidos
const BASE_LOCK_TIME = 5 * 60 * 1000; // Tiempo base de bloqueo: 5 minutos

// Función para verificar patrones de inyección SQL
const hasSqlInjection = (input) => {
    if (!input) return false;
    const value = String(input);
    // Expresión regular para detectar palabras clave de SQL y caracteres peligrosos
    // Detecta: SELECT, INSERT, etc., comillas simples ('), punto y coma (;), comentarios (--)
    const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|UNION|EXEC|FROM)\b)|(')|(;)|(--)/i;
    return sqlPattern.test(value);
};

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        console.log("Intento de registro para el email:", req.body.email);
        const { name, email, password, rol } = req.body;

        // Verificación de seguridad contra Inyección SQL en todos los campos
        if (hasSqlInjection(name) || hasSqlInjection(email) || hasSqlInjection(password) || hasSqlInjection(rol)) {
            console.warn("Intento de Inyección SQL detectado en registro:", { email });
            return res.status(400).json({ 
                mensaje: "Solicitud rechazada por seguridad: Se detectaron caracteres o patrones no permitidos." 
            });
        }

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

        // Verificación de seguridad contra Inyección SQL en login
        if (hasSqlInjection(email) || hasSqlInjection(password)) {
            console.warn("Intento de Inyección SQL detectado en login:", { email });
            return res.status(400).json({ 
                mensaje: "Solicitud rechazada por seguridad: Se detectaron caracteres o patrones no permitidos." 
            });
        }

        // Verificar que los campos no estén vacíos
        if (!email || !password) {
            return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
        }

        // Verificar si la cuenta está bloqueada temporalmente antes de intentar login
        if (loginAttempts[email] && loginAttempts[email].lockUntil > Date.now()) {
            const remainingSeconds = Math.ceil((loginAttempts[email].lockUntil - Date.now()) / 1000);
            return res.status(429).json({ 
                mensaje: `Cuenta bloqueada por seguridad. Intenta de nuevo en ${remainingSeconds} segundos.` 
            });
        }

        // 1. Iniciar sesión con Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            // Registrar intento fallido
            if (!loginAttempts[email]) {
                loginAttempts[email] = { attempts: 1, lockUntil: null, blockCount: 0 };
            } else {
                loginAttempts[email].attempts += 1;
            }

            // Verificar si se superó el límite de intentos
            if (loginAttempts[email].attempts >= MAX_ATTEMPTS) {
                // Incrementar el contador de bloqueos sucesivos
                loginAttempts[email].blockCount += 1;

                // Calcular tiempo exponencial: 5min, 10min, 20min... (Base * 2^(bloqueos-1))
                const multiplier = Math.pow(2, loginAttempts[email].blockCount - 1);
                const lockTime = BASE_LOCK_TIME * multiplier;

                loginAttempts[email].lockUntil = Date.now() + lockTime;
                
                const minutes = Math.ceil(lockTime / 60000);
                return res.status(429).json({ 
                    mensaje: `Has excedido el límite de intentos. Tu cuenta ha sido bloqueada por ${minutes} minutos.` 
                });
            }

            console.error("Error de autenticación:", authError.message);
            return res.status(401).json({ mensaje: `Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - loginAttempts[email].attempts}` });
        }

        // Si el login es exitoso, reiniciar el contador de intentos para este usuario
        if (loginAttempts[email]) {
            delete loginAttempts[email];
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
