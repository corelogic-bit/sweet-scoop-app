import React from "react";

function DisplayStatus({ type, message }) {
    return (
        <div className={type === "success" ? "status-success" : "status-error"}>
            {message}
        </div>
    );
}

export default DisplayStatus;