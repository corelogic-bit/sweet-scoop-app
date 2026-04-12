import React from "react";

function LoginForm({username, password, setUsername, setPassword, handleSubmit}) {
    return (
        <form onSubmit={handleSubmit}>

            <div>
                <p>Username</p>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}

                />
            </div>

            <div>
                <p>Password</p>
                <input
                    type= "password"
                    value= {password}
                    onChange ={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;