import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Asegúrate de que este hook esté definido correctamente
import "../styles.css";
import "../styles2.css"; // Asegúrate de que tu archivo CSS esté correctamente importado

function HomeAdmin() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart, removeFromCart, decreaseQuantity, processPurchase } = useCart();
    const navigate = useNavigate();

    // Verificación de rol
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); // Si no hay token, redirigir al login
            return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar token
        const role = decodedToken.rol;

        if (role !== "admin") {
            navigate("/home"); // Si no es admin, redirigir a Home normal
        }
    }, [navigate]);

    // Cargar productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get("http://localhost:3000/productos", { headers });
                setProductos(response.data); // Asegúrate de que los productos se estén guardando correctamente
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Editar producto
    const handleEdit = (id) => {
        navigate(`/editar-producto/${id}`);
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.delete(`http://localhost:3000/productos/${id}`, { headers });
            setProductos(productos.filter((producto) => producto.id !== id));
            alert("Producto eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Error al eliminar el producto");
        }
    };

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="home">
            <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>

            <button onClick={() => navigate("/agregar-producto")} className="add-to-cart-btn">
                Agregar Producto
            </button>

            <div id="catalogo">
                <div id="productos">
                    {productos.map(({ id, imagen, nombre, descripcion, precio }) => (
                        <div key={id} className="producto">
                            <img src={imagen} alt={nombre} className="producto-img" />
                            <div>
                                <h3>{nombre}</h3>
                                <p>{descripcion}</p>
                                <p><strong>Precio: </strong>${precio}</p>
                                <button onClick={() => handleEdit(id)} className="edit-btn">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(id)} className="delete-btn">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;

