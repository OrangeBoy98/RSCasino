import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useState, useContext } from "react";
import '../css/login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const { loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const res = await axios.post(`${apiUrl}/auth/login`, credentials, { withCredentials: true });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate('/');
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
            if (err.response.status === 404) {
                alert("존재하지 않는 아이디입니다.");
            } else if (err.response.status === 400) {
                alert("비밀번호가 일치하지 않습니다.");
            }
            window.location.reload();
        }
    };

    return (
        <div className="login-form">
            <form>
                <div className="form-group">
                    <label htmlFor="username">아이디</label>
                    <input type="text" id="username" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" onChange={handleChange} />
                </div>
                <div className="button-group">
                    <button type="submit" disabled={loading} onClick={handleClick}>로그인</button>
                    <Link to="/register">
                        <button type="button">회원가입</button>
                    </Link>
                </div>
            </form>
            {error && alert(error.message)}
        </div>
    );
}

export default Login;
