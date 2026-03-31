import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./components/Homepage";
import FlavorsPage from "./components/FlavorsPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OrderHistoryPage from "./components/OrderHistoryPage";

function ProtectedRoute({ element }) {
    const userId = localStorage.getItem("userId");
    return userId ? element : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/flavors" element={<ProtectedRoute element={<FlavorsPage />} />} />
                <Route path="/order-history" element={<ProtectedRoute element={<OrderHistoryPage />} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;