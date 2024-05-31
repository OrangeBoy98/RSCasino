import Payment from "../models/Payment.js";
import User from "../models/User.js";
import axios from "axios";

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
      const payment = new Payment({
        imp_uid,
        merchant_uid,
        amount,
        buyer_email,
        buyer_name,
        status
      });
      await payment.save();

      const user = await User.findOne({ username: buyer_name});
      if(user) {
        user.money += amount;
        await user.save();
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
