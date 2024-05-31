import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ranking.css';

const Ranking = () => {
    const [users, setUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/user`);
                const sortData = res.data.sort((a, b) => b.money - a.money);
                setUsers(sortData);
                setTopUsers(sortData.slice(0, 3));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const renderUserTable = (users, startIndex) => (
        <div className="user-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Money</th>
                    </tr>
                </thead>
                <tbody>
                    {users.slice(startIndex, startIndex + 30).map((user, index) => (
                        <tr key={user._id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.money.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="ranking-container">
            <div className="top-users">
                {topUsers.map((user, index) => (
                    <div key={user._id} className={`top-user top-user-${index + 1}`}>
                        {user.username}
                    </div>
                ))}
            </div>
            <div className="user-tables">
                {renderUserTable(users, 0)}
            </div>
        </div>
    );
};

export default Ranking;
