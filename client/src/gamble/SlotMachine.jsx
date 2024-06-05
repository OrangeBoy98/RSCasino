import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../css/slotmachine.css';

const SlotMachine = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { user } = useContext(AuthContext);
  const [slotIndices, setSlotIndices] = useState([
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
    Math.floor(Math.random() * 6),
  ]);
  const [money, setMoney] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [viewAmount, setViewAmount] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [bets, setBets] = useState([]);
  const [roundWinners, setRoundWinners] = useState([]);

  const fetchBets = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/gamble/bets/${user._id}`, { withCredentials: true });
      setBets(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [apiUrl, user._id]);

  const fetchWinners = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/gamble/rounds/${user._id}`, { withCredentials: true });
      setRoundWinners(res.data);
    } catch (err) {
      console.log(err);
    }
  },[apiUrl, user._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/${user._id}`, { withCredentials: true });
        setMoney(res.data.money);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    fetchBets();
    fetchWinners();
  }, [apiUrl, user._id, fetchBets, fetchWinners]);

  const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓', '7️⃣', '🔔', '💎', '💰'];

  const placeBetAndSpin = async () => {
    if (betAmount > 0 && betAmount <= money) {
      setSpinning(true);
      try {
        // 배팅 요청
        await axios.post(`${apiUrl}/gamble/bet/${user._id}`, {
          userId: user._id,
          amount: betAmount
        }, { withCredentials: true });

        // 슬롯 스핀 시작
        const intervals = [];

        const spin = (slotIndex) => {
          setSlotIndices((prevIndices) => {
            const newIndices = [...prevIndices];
            newIndices[slotIndex] = (newIndices[slotIndex] + 1) % symbols.length;
            return newIndices;
          });
        };

        for (let i = 0; i < slotIndices.length; i++) {
          intervals[i] = setInterval(() => spin(i), 100);
        }

        setTimeout(() => {
          clearInterval(intervals[0]);
          setTimeout(() => {
            clearInterval(intervals[1]);
            setTimeout(() => {
              clearInterval(intervals[2]);
              setSpinning(false);

              // 결과 판단
              const finalSymbols = slotIndices.map((index) => symbols[index]);
              if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
                alert('축하드립니다 !!');
                completeRound();
                window.location.reload();
              } else {
                alert('다음 기회에 ...');
                window.location.reload();
              }
            }, 500);
          }, 500);
        }, 2000);
        
        fetchBets();
        setBetAmount('');
        setViewAmount('');
      } catch (err) {
        console.log(err);
        setSpinning(false);
      }
    } else {
      alert('Invalid bet amount or insufficient funds.');
    }
  };

  const completeRound = async () => {
    try {
      const res = await axios.post(`${apiUrl}/gamble/round/complete/${user._id}`, {}, { withCredentials: true });
      fetchBets();
      fetchWinners();
      alert(`${res.data.winner} won ${res.data.amount} money!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnChange = (e) => {
    let value = e.target.value;
    const numCheck = /^[0-9,]*$/.test(value); // 숫자와 콤마만 허용

    if (numCheck) {
      const numValue = value.replaceAll(',', '');
      setBetAmount(Number(numValue));
      value = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    setViewAmount(value);
  }

  return (
    <div className="slot-machine-container">
      <h1>Slot Machine</h1>
      <div className="slots">
        {slotIndices.map((slotIndex, index) => (
          <div key={index} className={`slot`}>
            <div className="slot-symbol slot-symbol-large">{symbols[slotIndex]}</div>
          </div>
        ))}
      </div>
      <div className="bet-section">
        <input
          type="text"
          value={viewAmount}
          onChange={handleOnChange}
          className="bet-input"
          placeholder="Enter your bet"
        />
        <button className="spin-button" onClick={placeBetAndSpin} disabled={spinning}>Place Bet and Spin</button>
      </div>
      <p className="money">배팅가능 금액: {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
      <div className="winners-table">
        <h2>Round Winners</h2>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Winner</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {roundWinners.map((round) => (
              <tr key={round.roundNumber}>
                <td>{round.roundNumber}</td>
                <td>{round.winner ? round.winner.username : 'No winner'}</td>
                <td>{round.bets.reduce((sum, bet) => sum + bet.amount, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bets-table">
        <h2>Current Bets</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Bet Amount</th>
            </tr>
          </thead>
          <tbody>
            {bets.map((bet) => (
              <tr key={bet._id}>
                <td>{bet.user.username}</td>
                <td>{bet.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotMachine;
