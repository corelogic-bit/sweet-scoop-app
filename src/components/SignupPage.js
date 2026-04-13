import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DisplayStatus from "./DisplayStatus";


function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [statusType, setStatusType] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function validate() {
        const usernamePattern = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;

        const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|io)$/i;

        const hasUpper = /[A-Z]/.test(password);

        const hasLower = /[a-z]/.test(password);

        const hasNumber = /[0-9]/.test(password);

        const hasSpecial = /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~]/.test(password);

        if (!usernamePattern.test(username)) {
            return "Username must be 3-20 characters, start with a letter, and use only letters, numbers, underscores, or hyphens.";
        }

        if (!emailPattern.test(email)) {
            return "Please enter a valid email.";
        }
        if ((password.length < 8) || (!hasUpper) || (!hasLower) || (!hasNumber) || (!hasSpecial)) {
            return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");


        const validationMessage = validate();
        if (validationMessage) {
            setStatusType("error");
            setMessage(validationMessage);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },    
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json(); 
        
            if (data.success) {
                setStatusType("success");
                setMessage(data.message);
                setTimeout(() => {
                    navigate("/login")
                }, 800);
            } else {
                    setStatusType("error");
                    setMessage(data.message);

            }

        } catch (error) {
            setStatusType("error");
            setMessage("Error connecting to server");
        }
    }


    return (
        <div>
            <Header />
            <div className="content">
                <h2>Signup</h2>

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
                        <p>Email</p>
                        <input

                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <div>
                        <p>Confirm Password</p>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Signup</button>
                </form>

                {message && <DisplayStatus type={statusType} message={message} />}

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
            <Footer />
        </div>
    );


}
export default SignupPage;
