import React from "react";

function FlavorItem({flavor, onAddToOrder}) {
    return(
        <div className = "flavor-card">
            <img src={flavor.image} alt={flavor.name} />
            <h3>{flavor.name}</h3>

            <p>{flavor.description}</p>
            <p>{flavor.price}</p>
            <button onClick={() => onAddToOrder(flavor)}>Add to Order</button>

        </div>
    );
}
export default FlavorItem;