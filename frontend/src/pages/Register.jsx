import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("usuario"); // Valor por defecto "usuario"
    const [specialKey, setSpecialKey] = useState(""); // Clave especial para admin
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Datos enviados al backend:", { name, email, password, role }); // Verifica que role esté aquí
            const payload = { name, email, password, rol: role }; // Asegúrate de enviar 'rol' en lugar de 'role'
            if (role === "admin") {
                payload.specialKey = specialKey;
            }
            await axios.post("http://localhost:3000/register", payload);
            alert("Registro exitoso. Inicia sesión.");
            navigate("/login");
        } catch (error) {
            const errorMessage = error.response?.data?.mensaje || "Error al registrar usuario.";
            alert(errorMessage);
        }
    };

    return (
        <div className="wrapper">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="role">Rol:</label>
                <select 
                    id="role" 
                    className="role-select"
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>

                {/* Si el rol seleccionado es admin, mostramos el input de clave especial */}
                {role === "admin" && (
                    <input
                        type="text"
                        placeholder="Clave especial para admin"
                        value={specialKey}
                        onChange={(e) => setSpecialKey(e.target.value)}
                        required
                        className="special-key-input"
                    />
                )}

                <button type="submit">Registrar</button>
            </form>

            {/* Mensaje y botón para iniciar sesión en una misma línea */}
            <div className="login-message">
                <p>¿Ya tienes cuenta?</p>
                <button onClick={() => navigate("/login")}>Iniciar sesión</button>
            </div>
        </div>
    );
}

export default Register;


