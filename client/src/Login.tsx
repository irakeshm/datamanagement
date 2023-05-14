import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default Login;


//http://localhost:3002/dataservice/data
//let accessToken = localStorage.getItem("accessToken");
