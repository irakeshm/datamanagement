import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
                const response = await axios.get<IData[]>("http://localhost:3002/dataservice/data", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log('response', response)
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
        // Perform logout logic
        // For example, clear user session or access token
        // Then navigate to the login page
        accessToken = '';
        localStorage.removeItem('accessToken')
        navigate("/");
    };

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ""; // Required for Chrome
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    if (!isLoggedIn) {
        return null; // Render nothing if not logged in
    }

    return (
        <div>
            <h1>Data List</h1>
            <button onClick={handleLogout}>Logout</button>
            <table>
                <thead>
                    <tr>
                        <th>App Name</th>
                        <th>App Path</th>
                        <th>App Owner</th>
                        <th>Is Valid</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((data, index) => (
                        <tr key={index}>
                            <td>{data.appName}</td>
                            <td>{data.appData.appPath}</td>
                            <td>{data.appData.appOwner}</td>
                            <td>{data.appData.isValid ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;
