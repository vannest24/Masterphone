import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditarProducto() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [stock, setStock] = useState("");
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el id del producto desde la URL

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(`http://localhost:3000/productos/${id}`, { headers });
                const producto = response.data;
                setNombre(producto.nombre);
                setDescripcion(producto.descripcion);
                setPrecio(producto.precio);
                setImagen(producto.imagen);
                setStock(producto.stock);
            } catch (error) {
                console.error("Error al obtener producto:", error);
                alert("Error al cargar los datos del producto.");
            }
        };

        fetchProducto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const updatedProduct = { nombre, descripcion, precio, imagen, stock };
            await axios.put(`http://localhost:3000/productos/${id}`, updatedProduct, { headers });
            alert("Producto actualizado exitosamente");
            navigate("/homeadmin"); // Redirigir a la página de administración
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            alert("Error al actualizar el producto.");
        }
    };

    return (
        <div className="wrapper">
            <h2>Editar Producto</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre del producto"
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
                    placeholder="Imagen (URL)"
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
                <button type="submit">Actualizar Producto</button>
            </form>
        </div>
    );
}

export default EditarProducto;
