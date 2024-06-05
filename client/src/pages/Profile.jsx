import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../css/profile.css'; // CSS 파일 import
import { Link } from 'react-router-dom';
import History from '../components/History';
import PayModal from '../components/PayModal';

const Profile = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        money: 0,
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [ modal, setModal ] = useState(false);

    const handleUpdateMode = () => {
        setUpdateMode(!updateMode);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/user/${user._id}`, { withCredentials: true });
                setProfile(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [apiUrl, user._id, setProfile]);

    const handleChange = (e) => {
        e.preventDefault();
        try {
            setProfile({
                ...profile,
                [e.target.id]: e.target.value,
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async () => {
        try {
            const res = await axios.put(`${apiUrl}/user/${user._id}`, profile, { withCredentials: true });
            setProfile(res.data);
            alert("수정완료");
            setUpdateMode(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {!updateMode ? (
                <div className="profile-info">
                    <div className="profile-row">
                        <label>Name</label>
                        <p>{profile.username}</p>
                    </div>
                    <div className="profile-row">
                        <label>Email</label>
                        <p>{profile.email}</p>
                    </div>
                    <div className="profile-row">
                        <label>Phone</label>
                        <p>{profile.phone}</p>
                    </div>
                    <div className="profile-row">
                        <label>Money</label>
                        <p>{profile.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    </div>
                    <div className="profile-buttons">
                        <button onClick={handleUpdateMode}>Edit</button>
                        <Link to='/'>
                            <button>Home</button>
                        </Link>
                        <button onClick={() => setModal(true)}>Payment</button>
                        {modal && <PayModal setModal={setModal} userEmail={profile.email} username={profile.username}/>}
                    </div>
                </div>
            ) : (
                <div className="profile-info">
                    <div className="profile-row">
                        <label>Name</label>
                        <p>{profile.username}</p>
                    </div>
                    <div className="profile-row">
                        <label>Email</label>
                        <input type="text" id="email" value={profile.email} onChange={handleChange} />
                    </div>
                    <div className="profile-row">
                        <label>Phone</label>
                        <input type="text" id="phone" value={profile.phone} onChange={handleChange} />
                    </div>
                    <div className="profile-row">
                        <label>Money</label>
                        <p>{profile.money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    </div>
                    <div className="profile-buttons">
                        <button onClick={handleUpdateMode}>Cancel</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            )}
            <History userId={user._id} />
        </div>
    )
}

export default Profile;
