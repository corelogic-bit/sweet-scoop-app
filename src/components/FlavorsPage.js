import React, {useState, useEffect} from "react";

import Header from "./Header";
import Footer from "./Footer";
import FlavorCatalog from "./FlavorCatalog";
import OrderList from "./OrderList";
import DisplayStatus from "./DisplayStatus";

function FlavorsPage() {
    const [flavors, setFlavors] = useState([]);
    const [cart, setCart] = useState([]);
    const [statusType, setStatusType] = useState("");
    const [message, setMessage] = useState("");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        loadFlavors();
        loadCart();

    }, []);

    async function loadFlavors() {
        try {
            const response = await fetch("http://localhost:5000/flavors");
            const data = await response.json(); 
            if (data.success) {
                setFlavors(data.flavors);
            }


        } catch (error) {
            setStatusType("error");
            setMessage("An error occurred while loading the flavors");
            
        }
    }
        
    
    async function loadCart() {
        try {
            const response = await fetch(`http://localhost:5000/cart?userId=${userId}`);
            const data = await response.json(); 
            if (data.success) {
                setCart(data.cart);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }


        } catch (error) {
            setStatusType("error");
            setMessage("An error occurred while loading the cart");
            
        }
    }

    async function handleAddToOrder(flavor) {
        const existingItem = cart.find((item) => item.flavorId === flavor.id);

        try {

            let response;

            if (existingItem) {
                response = await fetch("http://localhost:5000/cart", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: Number(userId),
                        flavorId: flavor.id,
                        quantity: existingItem.quantity + 1
                    })
                });
            } else {
                response = await fetch("http://localhost:5000/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: Number(userId),
                        flavorId: flavor.id
                    })
                });
            }

            const data = await response.json();

            if (data.success) {
                setCart(data.cart);
                setStatusType("success");
                setMessage(data.message);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }
        } catch (error) {
            setStatusType("error");
            setMessage("Could not update cart.");
        }
    }

    async function handleRemoveItem(flavorId) {
        try {
            const response = await fetch("http://localhost:5000/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: Number(userId),
                    flavorId: flavorId
                })
            });

            const data = await response.json();

            if (data.success) {
                setCart(data.cart);
                setStatusType("success");
                setMessage(data.message);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }
        } catch (error) {
            setStatusType("error");
            setMessage("Could not remove item.");
        }
    }

    async function handlePlaceOrder() {
        try {
            const response = await fetch("http://localhost:5000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: Number(userId) })
            });

            const data = await response.json();

            if (data.success) {
                setCart([]);
                setStatusType("success");
                setMessage(`Order placed successfully. Order ID: ${data.orderId}`);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }
        } catch (error) {
            setStatusType("error");
            setMessage("Could not place order.");
        }
    }

    return (
        <div>
            <Header />
            <div className="content">

                <h2>Flavors</h2>

                {message && <DisplayStatus type={statusType} message={message} />}

                <FlavorCatalog flavors={flavors} onAddToOrder={handleAddToOrder} />
                <OrderList



                    cart={cart}
                    onRemoveItem={handleRemoveItem}
                    onPlaceOrder={handlePlaceOrder}



                />
            </div>
            <Footer />
        </div>
    );









}
export default FlavorsPage;