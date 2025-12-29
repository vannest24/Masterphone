import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);
    const [comentarios, setComentarios] = useState(() => {
        const storedComentarios = localStorage.getItem("comentarios");
        return storedComentarios ? JSON.parse(storedComentarios) : {};
    });

    const { addToCart, cart, removeFromCart, decreaseQuantity, processPurchase } = useCart();
    const navigate = useNavigate();

    // Obtener usuarioId desde el token
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUsuarioId(decodedToken.id);
            if (decodedToken.rol !== "admin") navigate("/home");
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            navigate("/login");
        }
    }, [navigate]);

    // Obtener productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const { data } = await axios.get("http://localhost:3000/productos", { headers });
                setProductos(data);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const agregarComentario = (id) => {
        const comentario = prompt("Escribe tu comentario:");
        if (comentario) {
            setComentarios(prev => {
                const nuevosComentarios = {
                    ...prev,
                    [id]: [...(prev[id] || []), comentario],
                };
                localStorage.setItem("comentarios", JSON.stringify(nuevosComentarios));
                return nuevosComentarios;
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsuarioId(null);  // Limpiar el estado de usuarioId
        navigate("/login");
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const handleCheckout = () => {
        const total = cart.reduce((acc, { precio, quantity }) => acc + precio * quantity, 0);
        alert(`Pago procesado por un total de $${total.toFixed(2)}`);
        processPurchase();
    };

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div className="home">
            <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>

            <button id="carrito-icono" onClick={toggleCart} className={isCartOpen ? "animate-icon" : ""}>
                🛒
            </button>

            {isCartOpen && (
                <>
                    <div id="overlay" className="active-overlay" onClick={toggleCart}></div>
                    <div id="carrito-container" className="show-cart">
                        <button id="cerrar-carrito" onClick={toggleCart}>X</button>
                        <h2>Carrito de Compras</h2>
                        {cart.length === 0 ? (
                            <p>El carrito está vacío</p>
                        ) : (
                            <>
                                <ul>
                                    {cart.map(({ id, nombre, precio, quantity, imagen }) => (
                                        <li key={id} className="producto-carrito-item">
                                            <img src={imagen} alt={nombre} className="producto-img" />
                                            <div className="producto-info">
                                                <p><span>{nombre}</span></p>
                                                <p><span>Precio: ${precio}</span></p>
                                                <p><span>Cantidad: {quantity}</span></p>
                                                
                                                <div className="botones-horizontal">
                                                    <button onClick={() => decreaseQuantity(id)}>➖</button>
                                                    <button onClick={() => addToCart({ id, nombre, precio, imagen })}>➕</button>
                                                    <button onClick={() => removeFromCart(id)}>❌</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Total: </strong>${cart.reduce((acc, { precio, quantity }) => acc + precio * quantity, 0).toFixed(2)}</p>
                                <button onClick={handleCheckout} className="checkout-btn">Pagar 💳</button>
                            </>
                        )}
                    </div>
                </>
            )}

            <div id="catalogo" className={isCartOpen ? "catalogo-hidden" : ""}>
                <div id="productos">
                    {productos.map(({ id, imagen, nombre, descripcion, precio }) => (
                        <div key={id} className="producto">
                            <img src={imagen} alt={nombre} className="producto-img" />
                            <div>
                                <h3>{nombre}</h3>
                                <p>{descripcion}</p>
                                <p><strong>Precio: </strong>${precio}</p>
                                <button onClick={() => addToCart({ id, nombre, precio, imagen })}>Agregar al carrito</button>
                                <button onClick={() => agregarComentario(id)}>Agregar comentario</button>

                                {comentarios[id]?.length > 0 && (
                                    <div className="comentarios">
                                        <h4>Comentarios:</h4>
                                        <ul>
                                            {comentarios[id].map((coment, index) => (
                                                <li key={index}>{coment}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;









