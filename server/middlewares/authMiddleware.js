const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    throw new Error("La variable de entorno JWT_SECRET no está definida. La autenticación no funcionará.");
}

function verificarToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ mensaje: "Token no proporcionado" });
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            // Podrías agregar console.error(error) aquí para depuración interna
            return res.status(401).json({ mensaje: "Token no válido" });
        }
        req.usuario = decoded;
        next();
    });
}

function verificarAdmin(req, res, next) {
    if (!req.usuario || req.usuario.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    next();
}

module.exports = { verificarToken, verificarAdmin };
