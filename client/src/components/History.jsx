import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/history.css';

const History = ({userId}) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/history/${userId}`, {withCredentials: true});
                setHistory(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [apiUrl, userId])
    return (
        <div className="history-container">
            <h2 className="history-title">History</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Bet Amount</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item, index) => (
                        <tr key={index}>
                            <td>{item.betType}</td>
                            <td>{item.betAmount.toLocaleString()}</td>
                            <td>{item.result < item.betAmount ? 'Loss' : (item.result === item.betAmount ? 'Draw' : 'Win')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default History;