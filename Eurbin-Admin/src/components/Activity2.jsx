import { Outlet, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from 'react';
import smallPlastic from '../Images/smallPlastic.jpg'
import largePlastic from '../Images/largePlastic.jpg'


function Activity2() {

    const API_URL = 'https://eurbin.vercel.app/bottles';
    const [bottle, setBottles] = useState([]);

    useEffect(() => {
        fetchBottle(); 
    }, []);

    const fetchBottle = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200 && Array.isArray(response.data.bottles)) {
                setBottles(response.data.bottles);
                console.log('Bottles fetched successfully:', response.data.bottles);
            } else {
                console.error('Unexpected data format:', response.data);
                alert('An error occurred: Unexpected data format');
            }
        } catch (err) {
            console.error('Error fetching bottles:', err);
            alert('An error occurred while fetching bottles');
        }
    }

    const location = useLocation();

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleString('en-US', options);
    }

    return (
        <>
            <h1 className='headings'>Bin Management</h1>

            

            <div className="rmdHeaders">
            <p>EURBin Status: </p>
            <div className="binLevel">
                <div className="binPercent">
                    <p>80%</p>
                </div>
            </div>
            <div className="activityButton">      
                <Link to="/Activity2" >
                    <button className={location.pathname === "/Activity2" ? "active-btn" : "inactive-btn"} >
                    Activity
                    </button>
                </Link>
            </div>
        </div>

            <div className="table-container">
                <table className="w3-table-all">
                    <thead>
                        <tr className="w3-light-grey">
                            <th>Bottle</th>
                            <th>Size</th>
                            <th>Redeem Code</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapping over bottles data */}
                        {bottle.length > 0 ? (
                            bottle.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <img 
                                            src={item.Size === "Small" ? smallPlastic : largePlastic} 
                                            alt={item.Size === "Small" ? "Small Bottle" : "Large Bottle"} 
                                            style={{ width: '40px', height: '100px', borderRadius: '10px' }} 
                                        />
                                    </td>
                                    <td>{item.Size}</td>
                                    <td>{item.Code}</td>
                                    <td>{formatDate(item.date)}</td> {/* Format date */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No bottles found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Activity2;