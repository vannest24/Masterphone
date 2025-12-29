import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, password };
            const response = await axios.post("http://localhost:3000/login", payload);

            // Guardar token en localStorage
            const token = response.data.token;
            localStorage.setItem("token", token);

            // Decodificar el token para obtener el rol
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const role = decodedToken.rol; // Aquí obtienes el rol del usuario

            // Redirigir según el rol
            if (role === "admin") {
                navigate("/homeadmin"); // Si el rol es 'admin', redirigir a HomeAdmin
            } else {
                navigate("/home"); // Si el rol es de usuario, redirigir a Home normal
            }

            alert("Inicio de sesión exitoso.");
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || "Error al iniciar sesión.";
            alert(errorMessage);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#E5E5E5] overflow-hidden">
            {/* Formas orgánicas de fondo (Manchas) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

            <h1 className="absolute top-20 text-4xl font-bold text-black z-10 text-center">Bienvenido a MasterPhone</h1>

            <div className="relative w-full max-w-md">
                {/* Borde animado con efecto de haz de luz (Conic Gradient) */}
                <div className="absolute inset-0 rounded-lg overflow-hidden z-10 pointer-events-none">
                    <div 
                        className="absolute inset-0" 
                        style={{
                            padding: '3px', // Grosor del borde
                            background: 'transparent',
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'exclude',
                            WebkitMaskComposite: 'xor',
                            borderRadius: 'inherit'
                        }}
                    >
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-[250%] h-[250%]"
                            style={{
                                background: 'conic-gradient(from 0deg, transparent 0%, transparent 50%, #B2A79F 70%, #B2B09F 85%, #AAB29F 95%, transparent 100%)',
                                translate: '-50% -50%',
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#E9D5FF] backdrop-blur-md border border-white/20 rounded-lg shadow-lg w-full"
                    style={{ padding: '3rem' }}
                >
                <h2 className="text-2xl font-bold mb-6 text-center !text-black">Iniciar sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#011815] rounded-md focus:outline-none focus:ring-2 focus:ring-[#011815] bg-[#ECEC9C] !text-black placeholder:!text-gray-600"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#011815] rounded-md focus:outline-none focus:ring-2 focus:ring-[#011815] bg-[#ECEC9C] !text-black placeholder:!text-gray-600"
                    />
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full font-bold"
                    >
                        Iniciar Sesión
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/register")} className="w-full">Registrar</button>
                </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;
