import axios from "axios";
import pool from '../db.js'; 
import dotenv from 'dotenv';

dotenv.config();

const IAMPORT_API_KEY = process.env.IAMPORT_API_KEY;
const IAMPORT_API_SECRET = process.env.IAMPORT_API_SECRET;

// 아임포트 액세스 토큰 요청 함수
export const getToken = async () => {
  try {
    const response = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: IAMPORT_API_KEY,
      imp_secret: IAMPORT_API_SECRET,
    });
    return response.data.response.access_token;
  } catch (error) {
    console.error('Error fetching Iamport access token:', error);
    throw error;
  }
};

// 결제 검증 함수
export const verifyPayment = async (req, res) => {
  const { imp_uid } = req.params;

  try {
    const token = await getToken();
    const paymentData = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
      headers: { Authorization: token }
    });

    const { amount, status, merchant_uid, buyer_email, buyer_name } = paymentData.data.response;

    if (status === 'paid') {
      // 결제가 성공적으로 완료된 경우, 데이터베이스에 저장
      await pool.query(`INSERT INTO Payments (imp_uid, merchant_uid, amount, buyer_email, buyer_name, status) values (?, ?, ?, ?, ?, ?)`, 
        [imp_uid, merchant_uid, amount, buyer_email, buyer_name, status]
      );

      const [rows] = await pool.query(`SELECT * FROM Users WHERE email = ?`, [buyer_email]);
      const user = rows[0];
      if(user) {
        user.money += amount;
        await pool.query(`UPDATE Users SET money = ? WHERE email = ?`, [user.money, buyer_email]);
      }

      res.status(200).json({ response: { amount } });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
