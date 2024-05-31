import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import '../css/home.css';

const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const [ money, setMoney ] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/${user._id}`, {withCredentials: true});
        setMoney(res.data.money);
      } catch (e) {
        console.log(e);
      }
    }
    if (user) {
      fetchData();
    }
  }, [apiUrl, user]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = parseInt(localStorage.getItem('token_expiration'), 10);
      if (tokenExpiration && new Date().getTime() > tokenExpiration) {
        handleLogoutButton();
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000 * 60); // 매 분마다 확인
    return () => clearInterval(interval);
  }, []);

  const handleLoginButton = () => {
    navigate("/login");
  };

  const handleLogoutButton = async () => {
    try {
      const res = await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      dispatch({ type: "LOGOUT" });
      navigate("/");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfile = () => {
    if(user){
      navigate('/profile')
    } else {
      alert("로그인 후 이용이 가능합니다.")
      navigate('/login');
    }
  }

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      alert("로그인 후 이용이 가능합니다.");
      navigate('/login');
    }
  }

  return (
    <div className="home-container">
      <div className="header">
        <h1 className="site-title">으갸갸갸갸갹</h1>
        <div className="nav-buttons">
          {!user ? (
              <span className="user-money"></span>
            ) : (
              <span className="user-money">{user.username}님의 잔액 : {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            )}
          <button className='navButton' onClick={handleProfile}>Profile</button>
          {!user ? (
            <button className="navButton" onClick={handleLoginButton}>Login</button>
          ) : (
            <button className="navButton" onClick={handleLogoutButton}>Logout</button>
          )}
        </div>
      </div>
      <div className="content">
        <div className="main-content">
          <div className="game-grid">
            <button className="gameButton" onClick={() => handleNavigation('/gamble/random')}>RULETTE</button>
            <button className="gameButton" onClick={() => handleNavigation('/gamble/odd-even')}>OddEven</button>
            <button className="gameButton" onClick={() => handleNavigation('/shop')}>Shop</button>
            <button className="gameButton" onClick={() => handleNavigation('/ranking')}>RANKING</button>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 으갸갸갸갸갹. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
