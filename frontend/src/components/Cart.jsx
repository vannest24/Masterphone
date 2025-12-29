import { useCart } from "../context/CartContext";

const Cart = () => {
    const { cart, addToCart, removeFromCart, decreaseQuantity, processPurchase } = useCart();

    return (
        <div>
            <h2>Carrito de Compras 🛒</h2>
            {cart.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.name} - ${item.price} x {item.quantity}
                                <button onClick={() => addToCart(item)}>➕</button>
                                <button onClick={() => decreaseQuantity(item.id)}>➖</button>
                                <button onClick={() => removeFromCart(item.id)}>❌</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={processPurchase}>Procesar Compra ✅</button>
                </>
            )}
        </div>
    );
};

export default Cart;
