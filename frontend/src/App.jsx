import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import HomeAdmin from "./pages/HomeAdmin"; // Importamos HomeAdmin
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import AgregarProducto from "./pages/AgregarProducto"; // Importamos AgregarProducto
import EditarProducto from "./pages/EditarProducto"; // Importamos EditarProducto
import { CartProvider } from "./context/CartContext"; 
import "./styles.css";

// PrivateRoute para proteger las rutas de admin
function PrivateRoute({ element, ...rest }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" />;
    }
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.rol;
    
    if (role !== "admin") {
        return <Navigate to="/home" />;
    }

    return element;
}

function App() {
    return (
        <CartProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/homeadmin" element={<PrivateRoute element={<HomeAdmin />} />} /> {/* Ruta para HomeAdmin */}
                    <Route path="/agregar-producto" element={<PrivateRoute element={<AgregarProducto />} />} /> {/* Ruta para AgregarProducto */}
                    <Route path="/editar-producto/:id" element={<PrivateRoute element={<EditarProducto />} />} /> {/* Ruta para EditarProducto */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </Router>
        </CartProvider>
    );
}

export default App;









