import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import '../css/register.css';

const Register = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
    });
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [duplicateCheck, setDuplicateCheck] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPasswordMatch(credentials.password === passwordConfirm);
    }, [credentials.password, passwordConfirm]);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!duplicateCheck) {
            return alert('아이디를 확인해주세요.');
        }
        if (!passwordMatch) {
            return alert('비밀번호를 확인해주세요.');
        }
        try {
            const res = await axios.post(`${apiUrl}/auth/register`, credentials, { withCredentials: true });
            console.log(res.data);
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };

    const handleDuplicateCheck = async (e) => {
        e.preventDefault();
        if (credentials.username.length < 4) {
            return alert('아이디는 4글자 이상이어야 합니다.');
        }
        try {
            const res = await axios.get(`${apiUrl}/auth/duplicateCheck/${credentials.username}`);
            //console.log(res.data.message);
            if (res.data.message === 'possible') {
                alert('사용가능한 아이디입니다.');
                setDuplicateCheck(true);
            } else {
                alert('이미 사용중인 아이디입니다.');
                setDuplicateCheck(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="register-form">
            <form>
                <div className="form-group">
                    <label htmlFor="username">아이디</label>
                    <div className="input-group">
                        <input type="text" id="username" onChange={handleChange} />
                        <button onClick={handleDuplicateCheck}>중복확인</button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordConfirm">비밀번호 확인</label>
                    <input type="password" id="passwordConfirm" onChange={handlePasswordConfirmChange} />
                    {!passwordMatch && (
                        <div className="subMessage" style={{color:'#ff6347'}}>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">전화번호</label>
                    <input type="tel" id="phone" onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        handleChange(e);
                    }} />
                    <div className="subMessage" style={{color:'#ffffff'}}>' - ' 을 생략하고 입력해주세요.</div>
                </div>
                <button type="submit" onClick={handleClick}>회원가입</button>
            </form>
        </div>
    );
}

export default Register;
