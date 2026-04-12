import React from "react";
import FlavorItem from "./FlavorItem";

function FlavorCatalog({flavors, onAddToOrder}) {
    return (
        <div className = "flavor-grid">
            {flavors.map((flavor) => (
                <FlavorItem
                    key = {flavor.id}
                    flavor = {flavor}
                    onAddToOrder = {onAddToOrder}
                />
            ))}
        </div>
    );
}
export default FlavorCatalog;