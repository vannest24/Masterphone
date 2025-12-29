import { useState } from "react";
import axios from "axios";

function AddProduct() {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:3000/productos", { nombre, precio }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Producto agregado");
        } catch (error) {
            alert("Error al agregar producto");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre del producto" onChange={(e) => setNombre(e.target.value)} required />
            <input type="number" placeholder="Precio" onChange={(e) => setPrecio(e.target.value)} required />
            <button type="submit">Agregar Producto</button>
        </form>
    );
}

export default AddProduct;
