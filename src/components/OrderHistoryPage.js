import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import DisplayStatus from "./DisplayStatus";


function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [statusType, setStatusType] = useState("");
    const [message, setMessage] = useState("");
    const userId = localStorage.getItem("userId");



    useEffect(() => {
        loadOrders();
    }, []);



    async function loadOrders() {
        try {

            const response = await fetch(`http://localhost:5000/orders?userId=${userId}`);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }
        } catch (error) {

            setStatusType("error");
            setMessage("Couldn't load order history.");
        }
    }

    return (
        <div>
            <Header />
            <div className="content">


                <h2>Order History</h2>

                {message && <DisplayStatus type={statusType} message={message} />}

                {orders.length === 0 ? (
                    <p>No orders placed yet</p>
                ) : (
                    orders.map((order) => (


                        <div key={order.orderId} className="order-history-card">

                            <h3>Order #{order.orderId}</h3>



                            <p>{order.timestamp}</p>


                            {order.items.map((item) => (

                                <p key={item.flavorId}>

                                    ({item.name} x {item.quantity}) = $


                                    {(Number(item.price) * item.quantity).toFixed(2)}
                                </p>
                            ))}

                            <p><strong>Total: ${Number(order.total).toFixed(2)}</strong></p>

                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );




}


export default OrderHistoryPage;