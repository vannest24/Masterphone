import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [usuarioId, setUsuarioId] = useState(null);

    // Obtener el usuario actual desde el token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUsuarioId(decodedToken.id);
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
    }, []);

    // Cargar el carrito cuando se establezca usuarioId
    useEffect(() => {
        if (usuarioId) {
            const storedCart = localStorage.getItem(`cart_${usuarioId}`);
            setCart(storedCart ? JSON.parse(storedCart) : []);
        }
    }, [usuarioId]);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        if (usuarioId && cart.length >= 0) {
            localStorage.setItem(`cart_${usuarioId}`, JSON.stringify(cart));
        }
    }, [cart, usuarioId]);

    const addToCart = async (product) => {
        if (!usuarioId) return; // Asegurar que usuarioId esté definido

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            // Aquí se puede agregar la solicitud al backend para agregar el producto al carrito
            await axios.post("http://localhost:3000/carrito", { product }, { headers });
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }

        // Actualizar el carrito localmente
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.id === product.id);
            if (existingProduct) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const decreaseQuantity = (productId) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0) // Elimina productos con cantidad 0
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const processPurchase = () => {
        alert("Compra realizada con éxito 🎉");
        setCart([]); // Vacía el carrito después de la compra
        localStorage.removeItem(`cart_${usuarioId}`); // Eliminar del localStorage
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, processPurchase }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);






