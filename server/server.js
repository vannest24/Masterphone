// server.js
require("dotenv").config(); // Cargar las variables de entorno
const express = require("express"); // Framework Express
const cors = require("cors"); // Middleware para habilitar CORS
const authRoutes = require("./routes/authRoutes"); // Rutas de autenticación
const productRoutes = require("./routes/productRoutes"); // Rutas de productos
const orderRoutes = require("./routes/orderRoutes"); // Rutas de pedidos

const app = express();

// Middleware para parsear los cuerpos de las peticiones como JSON
app.use(express.json());

// Middleware para habilitar CORS (intercambio de recursos entre dominios)
app.use(cors());


// Rutas
app.use(authRoutes); // Rutas de autenticación
app.use("/productos", productRoutes); // Rutas de productos
app.use("/pedidos", orderRoutes); // Rutas de pedidos

// Configuración del puerto para escuchar las peticiones
const PORT = process.env.PORT || 3000; // Usar el puerto del archivo .env o el puerto 3000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de confirmación
});




