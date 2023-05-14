import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import './Home.css'

interface IData {
    appName: string;
    appData: {
        appPath: string;
        appOwner: string;
        isValid: boolean;
    };
}

interface Props {
    isLoggedIn: boolean;
}

let accessToken = localStorage.getItem("accessToken");

function Home({ isLoggedIn }: Props) {
    const [dataList, setDataList] = useState<IData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [updatedAppName, setUpdatedAppName] = useState("");
    const [updatedAppPath, setUpdatedAppPath] = useState("");
    const [updatedAppOwner, setUpdatedAppOwner] = useState("");
    const [updatedIsValid, setUpdatedIsValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            // Redirect to login page if not logged in
            navigate("/");
            return;
        }

        // Fetch data from backend API
        const fetchData = async () => {
            try {
                const response = await axios.get<IData[]>(
                    "http://localhost:3002/dataservice/data",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setDataList(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        return () => {
            // Clean up the data list when the component is unmounted
            setDataList([]);
        };
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        accessToken = "";
        localStorage.removeItem("accessToken");
        navigate("/");
    };

    const handleUpdate = (appName: string) => {
        // Find the data entry by appName
        const dataEntry = dataList.find((data) => data.appName === appName);
        if (dataEntry) {
            // Set the initial values in the modal form fields
            setUpdatedAppName(dataEntry.appName);
            setUpdatedAppPath(dataEntry.appData.appPath);
            setUpdatedAppOwner(dataEntry.appData.appOwner);
            setUpdatedIsValid(dataEntry.appData.isValid);
            // Show the modal
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const fetchData = () => {
        axios
            .get<IData[]>("http://localhost:3002/dataservice/data", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const handleDelete = (appName: string) => {
        // Confirm with the user before deleting
        if (window.confirm(`Are you sure you want to delete ${appName}?`)) {
            // Call the delete endpoint
            axios
                .delete(`http://localhost:3002/dataservice/data/${appName}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((response) => {
                    console.log("Delete successful:", response.data);
                    // Fetch updated data after deletion
                    fetchData();
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                    // Handle error scenario
                });
        }
    };


    const handleModalSubmit = () => {
        // Call the update endpoint with the updated data
        axios
            .put(`http://localhost:3002/dataservice/data/${updatedAppName}`, {
                appName: updatedAppName,
                appData: {
                    appPath: updatedAppPath,
                    appOwner: updatedAppOwner,
                    isValid: updatedIsValid,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log("Update successful:", response.data);
                // Close the modal and fetch updated data
                setShowModal(false);
                fetchData();
            })
            .catch((error) => {
                console.error("Update error:", error);
                // Handle error scenario
            });
    };


    if (!isLoggedIn) {
        return null; // Render nothing if not logged in
    }

    return (
        <div className="home-container">
            <h1 className="title">Data List</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>App Name</th>
                        <th>AppData/App Path</th>
                        <th>AppData/App Owner</th>
                        <th>AppData/Is Valid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((data, index) => (
                        <tr key={index}>
                            <td>{data.appName}</td>
                            <td>{data.appData.appPath}</td>
                            <td>{data.appData.appOwner}</td>
                            <td>{data.appData.isValid ? "Yes" : "No"}</td>
                            <td>
                                <button className="update-button" onClick={() => handleUpdate(data.appName)}>Update</button>
                                <button className="delete-button" onClick={() => handleDelete(data.appName)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update App Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>App Path</label>
                            <input
                                type="text"
                                value={updatedAppPath}
                                onChange={(e) => setUpdatedAppPath(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>App Owner</label>
                            <input
                                type="text"
                                value={updatedAppOwner}
                                onChange={(e) => setUpdatedAppOwner(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Is Valid</label>
                            <input
                                type="checkbox"
                                checked={updatedIsValid}
                                onChange={(e) => setUpdatedIsValid(e.target.checked)}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}

export default Home;
