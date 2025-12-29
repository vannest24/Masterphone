import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cart } = useCart();

    return (
        <nav style={{ 
            display: "none", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "10px", 
            background: "#f8f9fa" 
        }}>
            <div>
                <Link to="/homeadmin" style={{ marginRight: "15px", textDecoration: "none", color: "black" }}>
                    Inicio
                </Link>
                <Link to="/cart" style={{ textDecoration: "none", color: "black" }}>
                    Carrito 🛒 ({cart?.length || 0}) {/* Evita errores si cart es undefined */}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;




