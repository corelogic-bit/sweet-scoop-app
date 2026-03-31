import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    function handleLogout() {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate("/");
    }

    return (
        <div>
            <header>
                <div className="header-left">
                    <img src="/images/logo.webp" alt="Sweet Scoop Logo" />
                    <h1>Sweet Scoop Ice Cream Shop</h1>
                </div>
                <div>
                    {username ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </header>
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to="/flavors">Flavors</Link>
                <Link to="/order-history">Order History</Link>
            </div>
        </div>
    );
}

export default Header;