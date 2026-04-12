import React from "react";
import OrderItem from "./OrderItem";

function OrderList({ cart, onRemoveItem, onPlaceOrder }) {
    const total = cart.reduce(
        (sum, item) => sum + Number(item.price)*item.quantity, 0 );

        return (
            <div className = "order-list">
                <h2> Your Order</h2>
                {cart.length === 0 ? (
                    <p>Your Cart is Empty.</p>
            ) : (
                <>
                    {cart.map((item) => (

                        <OrderItem
                            key={item.flavorId}
                            item={item}
                            
                            onRemoveItem={onRemoveItem}
                        />
                    ))}

                    <p><strong>Total: ${total.toFixed(2)}</strong></p>
                    <button onClick={onPlaceOrder}>Place Order</button>
                </>
            )}
        </div>
    );
}
export default OrderList;
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
