import React from "react";

function OrderItem({item, onRemoveItem}) {
    return (
        <div>
            <h4>{item.name}</h4>
            <p>Quantity: {item.quantity}</p>
            <button className = "remove" onClick = {() =>onRemoveItem(item.flavorId)}>
                Remove Item
            </button>
            <hr />



        </div>
    )
}

export default OrderItem;