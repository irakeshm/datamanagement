import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

interface Props {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

enum ErrorCode {
    InvalidCredentials = 401,
    ServerError = 500,
}

function Login({ setIsLoggedIn }: Props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password.");
            return;
        }

        setError(""); // Clear the error if both fields are filled

        axios
            .post("http://localhost:3002/dataservice/login", { username, password })
            .then((response) => {
                localStorage.setItem("accessToken", response.data.accessToken);
                setIsLoggedIn(true);
                navigate("/home");
            })
            .catch((error) => {
                if (error.response && error.response.status) {
                    const errorCode = error.response.status;
                    let errorMessage = "";

                    switch (errorCode) {
                        case ErrorCode.InvalidCredentials:
                            errorMessage = "Invalid credentials. Please try again.";
                            break;
                        case ErrorCode.ServerError:
                            errorMessage = "Server error. Please try again later.";
                            break;
                        default:
                            errorMessage = "An error occurred. Please try again.";
                            break;
                    }

                    setError(errorMessage);
                } else {
                    setError("An error occurred. Please try again.");
                }
            });
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleSubmit}>
                <div className="login-form-header">
                    <h2 className="login-form-title">Login</h2>
                    <p className="login-form-subtitle">Please enter your credentials</p>

                    {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

                    <Form.Control
                        className="login-form-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(""); // Clear the error when the username field is modified
                        }}
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
                </div>
            </Form>
        </div>
    );
}
export default Login;
