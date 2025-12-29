import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
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
        setCart((prevCart) => {
            return prevCart
                .map((item) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0); // Elimina si la cantidad llega a 0
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const processPurchase = () => {
        alert("Compra realizada con éxito 🎉");
        setCart([]); // Vacía el carrito después de la compra
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, processPurchase }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

