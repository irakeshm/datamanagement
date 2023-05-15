import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import './Home.css';
import config from "../config/config";
import IData from "../config/Idata";
import { Constants } from '../config/const'



interface Props {
    isLoggedIn: boolean;
}

const dataServiceHost = config.dataServiceHost;
const dataServicePort = config.dataServicePort;
let accessToken = localStorage.getItem(Constants.ACCESS_TOKEN);

function Home({ isLoggedIn }: Props) {
    const [dataList, setDataList] = useState<IData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [updatedAppName, setUpdatedAppName] = useState("");
    const [updatedAppPath, setUpdatedAppPath] = useState("");
    const [isAddMode, setIsAddMode] = useState(true);
    const [updatedAppOwner, setUpdatedAppOwner] = useState("");
    const [updatedIsValid, setUpdatedIsValid] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [error, setError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);


    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
            return;
        }
        fetchData();
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        setIsFormValid(
            updatedAppName.trim() !== "" &&
            updatedAppPath.trim() !== "" &&
            updatedAppOwner.trim() !== ""
        );
    }, [updatedAppName, updatedAppPath, updatedAppOwner]);

    const fetchData = () => {
        fetchDataAndUpdate();
    };

    const fetchDataAndUpdate = () => {
        setIsLoading(true);
        axios
            .get<IData[]>(dataServiceHost + ":" + dataServicePort + "/dataservice/data", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = event.target.value.toLowerCase();
        setSearchTerm(keyword);
    };

    const filteredDataList = dataList.filter((data) => {
        const appNameMatches = data.appName.toLowerCase().includes(searchTerm);
        const appPathMatches = data.appData.appPath.toLowerCase().includes(searchTerm);
        const appOwnerMatches = data.appData.appOwner.toLowerCase().includes(searchTerm);
        const isValidMatches = data.appData.isValid.toString().toLowerCase().includes(searchTerm);
        return appNameMatches || appPathMatches || appOwnerMatches || isValidMatches;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDataList.slice(indexOfFirstItem, indexOfLastItem);

    const handleLogout = () => {
        navigate("/");
    };

    const handleUpdate = (appName: string) => {
        const dataEntry = dataList.find((data) => data.appName === appName);
        if (dataEntry) {
            setUpdatedAppName(dataEntry.appName);
            setUpdatedAppPath(dataEntry.appData.appPath);
            setUpdatedAppOwner(dataEntry.appData.appOwner);
            setUpdatedIsValid(dataEntry.appData.isValid);
            setIsEditMode(true);
            setShowModal(true);
        }
    };

    const handleDelete = (appName: string) => {
        if (window.confirm(`Are you sure you want to delete ${appName}?`)) {
            axios
                .delete(dataServiceHost + ":" + dataServicePort + `/dataservice/data/${appName}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((response) => {
                    console.log("Delete successful:", response.data);
                    fetchData();
                })
                .catch((error) => {
                    console.error("Delete error:", error);
                });
        }
    };

    const handleModalSubmit = () => {
        const trimmedAppName = updatedAppName.trim();

        if (trimmedAppName === '') {
            setError('App Name is required.');
        } else if (trimmedAppName.includes(' ')) {
            setError('App Name cannot contain spaces.');
        } else {
            if (isEditMode) {
                axios
                    .put(
                        dataServiceHost + ":" + dataServicePort + `/dataservice/data/${updatedAppName}`,
                        {
                            appName: updatedAppName,
                            appData: {
                                appPath: updatedAppPath,
                                appOwner: updatedAppOwner,
                                isValid: updatedIsValid,
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log("Update successful:", response.data);
                        setShowModal(false);
                        fetchData();
                    })
                    .catch((error) => {
                        console.error("Update error:", error);
                    });
            } else {
                axios
                    .post(
                        dataServiceHost + ":" + dataServicePort + "/dataservice/data",
                        {
                            appName: updatedAppName,
                            appData: {
                                appPath: updatedAppPath,
                                appOwner: updatedAppOwner,
                                isValid: updatedIsValid,
                            },
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    .then((response) => {
                        console.log("Add new successful:", response.data);
                        setShowModal(false);
                        fetchData();
                    })
                    .catch((error) => {
                        console.error("Add new error:", error);
                    });
            }
            setError('');
        }
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };
    const handleAddNew = () => {
        setShowModal(true);
        setIsEditMode(false);
        setUpdatedAppName("");
        setUpdatedAppPath("");
        setUpdatedAppOwner("");
        setUpdatedIsValid(false);
    };

    const handleCloseModal = () => {
        setError('');
        setShowModal(false);
    };

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="home-container">
            <div className="header">
                <h1 className="title">App Data</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="actions-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search By- App Name, App Path, App Owner and Validity"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="add-new-button" onClick={handleAddNew}>Add New</button>
                <button className="add-new-button" onClick={fetchDataAndUpdate}>Refresh</button>

            </div>
            {showSuccessMessage && (
                <div className="success-message">
                    {isEditMode ? "Update Opertion Successful" : "Add Record Opertion Successful"}
                </div>
            )}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>App Name</th>
                        <th>App Path</th>
                        <th>App Owner</th>
                        <th>Is Valid</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((data, index) => (
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
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <button
                    disabled={indexOfLastItem >= filteredDataList.length}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <div className="modal-container">
                    <div className="modal-content">
                        <Modal.Header>
                            <Modal.Title className="modal-title">
                                {isEditMode ? "Update App Data" : "Add New App"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                {(isAddMode || (isUpdateMode && updatedAppName !== "")) && (
                                    <div className="form-group">
                                        <label>App Name</label>
                                        <input
                                            type="text"
                                            value={updatedAppName}
                                            onChange={(e) => setUpdatedAppName(e.target.value)}
                                            disabled={isEditMode}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>App Path</label>
                                    <input
                                        type="text"
                                        value={updatedAppPath}
                                        onChange={(e) => setUpdatedAppPath(e.target.value)}
                                        disabled={isEditMode}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>App Owner</label>
                                    <input
                                        type="text"
                                        value={updatedAppOwner}
                                        onChange={(e) => setUpdatedAppOwner(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Is Valid</label>
                                    <input
                                        className="checkbox"
                                        type="checkbox"
                                        checked={updatedIsValid}
                                        onChange={(e) => setUpdatedIsValid(e.target.checked)}
                                        required
                                    />
                                </div>
                            </form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleModalSubmit} disabled={!isFormValid}>
                                {isEditMode ? "Update" : "Save"}
                            </Button>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
export default Home;
