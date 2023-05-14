import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

interface Props {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Login({ setIsLoggedIn }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios
            .post("http://localhost:3002/dataservice/login", { username, password })
            .then((response) => {
                // Store access token in local storage
                localStorage.setItem("accessToken", response.data.accessToken);
                // Set the login status in the App component
                setIsLoggedIn(true);
                // Redirect to home page
                navigate("/home");
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleSubmit}>
                <div className="login-form-header">
                    <h2 className="login-form-title">Login</h2>
                    <p className="login-form-subtitle">Please enter your credentials</p>
                </div>

                <Form.Control
                    className="login-form-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Form.Control
                    className="login-form-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="login-form-button" variant="contained" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default Login;