import React, { useState } from "react";

function FlavorItem({flavor, onAddToOrder}) {
    const [showDescription, setShowDescription] = useState(false);

    return(
        <div className="flavor-card"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <img src={flavor.image} alt={flavor.name} />
            <h3>{flavor.name}</h3>
            {showDescription && <p>{flavor.description}</p>}
            <p>{flavor.price}</p>
            <button onClick={() => onAddToOrder(flavor)}>Add to Order</button>
        </div>
    );
}
export default FlavorItem;