import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Datos enviados al backend:", { name, email, password });
            const payload = { name, email, password, rol: "usuario" };
            await axios.post("http://localhost:3000/register", payload);
            alert("Registro exitoso. Inicia sesión.");
            navigate("/login");
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || "Error al registrar usuario.";
            alert(errorMessage);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-[#E5E5E5] overflow-hidden">
            {/* Formas orgánicas de fondo (Manchas) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>

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
                            className="absolute top-1/2 left-1/2 w-[200%] h-[200%]"
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
                <h2 className="text-2xl font-bold mb-6 text-center !text-black">Registro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-[#011815] rounded-md focus:outline-none focus:ring-2 focus:ring-[#011815] bg-[#ECEC9C] !text-black placeholder:!text-gray-600"
                    />
                    <input
                        type="email"
                        placeholder="Email"
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
                        Registrar
                    </motion.button>
                </form>

                {/* Mensaje y botón para iniciar sesión en una misma línea */}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/login")} className="w-full">Iniciar sesión</button>
                </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Register;
