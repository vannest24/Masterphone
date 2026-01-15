import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modal, setModal] = useState({ show: false, message: "", type: "" }); // Estado del modal
    const navigate = useNavigate();

    const validations = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
    };

    // Función para cerrar el modal y redirigir si es éxito
    const closeModal = () => {
        setModal({ ...modal, show: false });
        if (modal.type === "success") {
            navigate("/login");
        }
    };

    // Cerrar modal automáticamente después de 3 segundos
    useEffect(() => {
        if (modal.show) {
            const timer = setTimeout(() => {
                closeModal();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [modal.show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setModal({ show: true, message: "Las contraseñas no coinciden.", type: "error" });
            return;
        }

        // Validación de contraseña: 8 caracteres, 1 minúscula, 1 mayúscula, 1 número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setModal({ show: true, message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.", type: "error" });
            return;
        }

        try {
            console.log("Datos enviados al backend:", { name, email, password });
            const payload = { name, email, password, rol: "usuario" };
            await axios.post("http://localhost:3000/register", payload);
            setModal({ show: true, message: "Registro exitoso. Ahora puedes iniciar sesión.", type: "success" });
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || "Error al registrar usuario.";
            setModal({ show: true, message: errorMessage, type: "error" });
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
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-[#011815] rounded-md focus:outline-none focus:ring-2 focus:ring-[#011815] bg-[#ECEC9C] !text-black placeholder:!text-gray-600 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center !text-black !bg-transparent hover:!bg-transparent border-none focus:outline-none"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-[#011815] rounded-md focus:outline-none focus:ring-2 focus:ring-[#011815] bg-[#ECEC9C] !text-black placeholder:!text-gray-600 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 px-3 flex items-center !text-black !bg-transparent hover:!bg-transparent border-none focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="text-sm space-y-1 mt-2 p-2">
                        <p className={validations.length ? "!text-green-700 font-bold" : "!text-red-600"}>
                            {validations.length ? "✓" : "X"} Mínimo 8 caracteres
                        </p>
                        <p className={validations.lowercase ? "!text-green-700 font-bold" : "!text-red-600"}>
                            {validations.lowercase ? "✓" : "X"} Una letra minúscula
                        </p>
                        <p className={validations.uppercase ? "!text-green-700 font-bold" : "!text-red-600"}>
                            {validations.uppercase ? "✓" : "X"} Una letra mayúscula
                        </p>
                        <p className={validations.number ? "!text-green-700 font-bold" : "!text-red-600"}>
                            {validations.number ? "✓" : "X"} Un número
                        </p>
                    </div>
                    
                    <motion.button 
                        type="submit"
                        className="w-full !p-[10px] !mt-[10px] !text-[14px] !tracking-[1px] !uppercase !font-medium !text-white !bg-gradient-to-br !from-[#A89D8F] !to-[#8F9AA8] !border-none !rounded-[50px] !shadow-[0px_8px_15px_rgba(0,0,0,0.3)] !cursor-pointer !transition-all !duration-300 !ease-in-out hover:!bg-gradient-to-br hover:!from-[#958774] hover:!to-[#929574] hover:!shadow-[0px_15px_20px_#957774] hover:!-translate-y-[5px] active:!scale-95"
                    >
                        Registrar
                    </motion.button>
                </form>

                {/* Mensaje y botón para iniciar sesión en una misma línea */}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/login")} className="w-full !p-[10px] !mt-[10px] !text-[14px] !tracking-[1px] !uppercase !font-medium !text-white !bg-gradient-to-br !from-[#A89D8F] !to-[#8F9AA8] !border-none !rounded-[50px] !shadow-[0px_8px_15px_rgba(0,0,0,0.3)] !cursor-pointer !transition-all !duration-300 !ease-in-out hover:!bg-gradient-to-br hover:!from-[#958774] hover:!to-[#929574] hover:!shadow-[0px_15px_20px_#957774] hover:!-translate-y-[5px] active:!scale-95">Iniciar sesión</button>
                </div>
                </motion.div>
            </div>

            {/* Modal Personalizado */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center border border-gray-200"
                        >
                            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${modal.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {modal.type === 'success' ? (
                                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${modal.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {modal.type === 'success' ? '¡Excelente!' : 'Atención'}
                            </h3>
                            <p className="!text-black mb-6">{modal.message}</p>
                            <button
                                onClick={closeModal}
                                className={`w-full py-2 px-4 rounded-full font-bold text-white transition-transform transform active:scale-95 ${modal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                Aceptar
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Register;
