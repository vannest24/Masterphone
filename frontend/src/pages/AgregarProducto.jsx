import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AgregarProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [stock, setStock] = useState("");
    const navigate = useNavigate();

    // Obtener el token del almacenamiento local
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = { 
                nombre, 
                descripcion, 
                precio: Number(precio), 
                imagen, 
                stock: Number(stock) 
            };

            // Configurar los headers con el token
            const headers = { Authorization: `Bearer ${token}` };

            // Enviar solicitud POST
            await axios.post("http://localhost:3000/productos", payload, { headers });

            alert("Producto agregado con éxito");
            navigate("/homeadmin");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            alert("Error al agregar el producto: " + error.message);
        }
    };

    return (
        <div className="wrapper">
            <h2>Agregar Producto</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="URL de la Imagen"
                    value={imagen}
                    onChange={(e) => setImagen(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
                <button type="submit">Agregar Producto</button>
            </form>
        </div>
    );
}

export default AgregarProducto;

