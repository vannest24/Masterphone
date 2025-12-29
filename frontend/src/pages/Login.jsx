import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div className="wrapper">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Iniciar Sesión</button>
            </form>

            {/* Agregar mensaje y botón para registrar */}
            <div className="register-message">
                <p>¿No tienes cuenta?</p>
                <button onClick={() => navigate("/register")}>Registrar</button>
            </div>
        </div>
    );
}

export default Login;





