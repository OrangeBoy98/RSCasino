import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../css/random.css';
import Rulette from '../components/Rulette';
import CryptoJS from 'crypto-js';

const Random = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { user } = useContext(AuthContext);
    const [betAmount, setBetAmount] = useState('');
    const [result, setResult] = useState(null);
    const [availableBetMoney, setAvailableBetMoney] = useState(0);
    const [mustSpin, setMustSpin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiUrl}/user/${user._id}`, { withCredentials: true });
                setAvailableBetMoney(res.data.money);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [apiUrl, user._id]);

    const handleBet = () => {
        const bet = parseInt(betAmount.replaceAll(',', ''));
        if (isNaN(bet) || bet <= 0 || bet > availableBetMoney) {
            alert('Please enter a valid bet amount');
            return;
        }

        setMustSpin(true);
    };

    const handleSpinComplete = async (option) => {
        let multiplier = 0;
        switch (option) {
            case '1x':
                multiplier = 1;
                break;
            case '2x':
                multiplier = 2;
                break;
            case '3x':
                multiplier = 3;
                break;
            case '5x':
                multiplier = 5;
                break;
            case '10x':
                multiplier = 10;
                break;
            default:
                multiplier = 0;
        }
        const cleanedBetAmount = betAmount.replaceAll(',', '');
        const finalResult = parseInt(betAmount.replaceAll(',', '')) * multiplier;
        alert(multiplier === 0 ? 'You lost your bet' : ('X' + multiplier + ' !!!'));

        const dataToEncrypt = JSON.stringify({ betAmount: cleanedBetAmount, result: finalResult });
        const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, process.env.REACT_APP_SECRET_KEY).toString();

        //console.log(encryptedData);

        try {
            const res = await axios.post(`${apiUrl}/gamble/random/${user._id}`, { data: encryptedData }, { withCredentials: true });
            const bytes = CryptoJS.AES.decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setAvailableBetMoney(decryptedData.newBalance); // 서버로부터 받은 새로운 잔액으로 업데이트
            setResult(finalResult);
        } catch (err) {
            console.log(err);
        } finally {
            setMustSpin(false);
            window.location.reload();
        }
    };
    const handleOnChange = (e) => {
        let value = e.target.value;		  // 입력값을 value 라고 선언 
        const numCheck = /^[0-9,]/.test(value); // 입력값이 숫자와 콤마(,)인지 확인 (불린값이 나옴)

        if (numCheck) { 				// 숫자이면 
          const numValue = value.replaceAll(',', ''); // 잠시 콤마를 때주고
          value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 받은 값에 3자리수마다 콤마를 추가
        }
        setBetAmount(value); // 바깥에서 사용할 수 있도록 state 값에 세팅해주자
    }

    return (
        <div className="random-bet-container">
            <div className="random-bet-content">
                <h2 className="title">Random Bet</h2>
                <span className="bet-money">배팅가능 금액: {availableBetMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span><br />
                <input
                    type="text"
                    id="betting"
                    value={betAmount}
                    onChange={handleOnChange}
                    className="bet-input"
                />
                <button onClick={handleBet} className="bet-button">배팅</button>
                <span className="result">결과: {result !== null ? (result > 0 ? `You won ${result}` : 'You lost your bet') : 'No result yet'}</span>
                
                <h3 className="probability-title">확률</h3>
                <ul className="probability-list">
                    <li>60% 확률로 잃음</li>
                    <li>20% 확률로 1배</li>
                    <li>10% 확률로 2배</li>
                    <li>5% 확률로 3배</li>
                    <li>4% 확률로 5배</li>
                    <li>1% 확률로 10배</li>
                </ul>
            </div>
            <div className="roulette-container">
                <Rulette mustSpin={mustSpin} onComplete={handleSpinComplete} />
            </div>
        </div>
    );
};

export default Random;
