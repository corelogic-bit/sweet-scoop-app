import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

import DisplayStatus from "./DisplayStatus";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [statusType, setStatusType] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        try{
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password})
            });
            const data = await response.json(); 
            if (data.success) {
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("username", username);
                setStatusType("success");
                setMessage(data.message);
                setTimeout(() => {
                    navigate("/flavors");
                }, 700);
            } else {
                setStatusType("error");
                setMessage(data.message);
            }
        } catch (error) {
            setStatusType("error");
            setMessage("An error occurred while logging in.");
            
        }
    }

    function handleForgotPassword() {
        setStatusType("error");
        
    }

    return (
        <div>
            <Header />

            <div className="content login-page">
                <h2>Login</h2>

                <form onSubmit={handleSubmit} className="login-form">
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Login</button>
                    <br></br>

                    <button
                        type="button"
                        className="forgot-btn"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </button>
                </form>

                {message && <DisplayStatus type={statusType} message={message} />}

                <p>
                    Not an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>

            <Footer />
        </div>
    );
}

export default LoginPage;



