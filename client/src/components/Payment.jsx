import React, {useEffect, useRef} from 'react';
import axios from 'axios';

const Payment = ({userEmail, username, amount}) => {
    const paymentButtonRef = useRef(null);

    useEffect(() => {
        const jquery = document.createElement('script');
        jquery.src = 'http://code.jquery.com/jquery-1.12.4.min.js';
        const iamport = document.createElement('script');
        iamport.src = 'http://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);

        return() => {
            document.head.removeChild(jquery);
            document.head.removeChild(iamport);
        };
    }, []);

    useEffect(() => {
        if (paymentButtonRef.current) {
            paymentButtonRef.current.onclick = () => kakaoPay(userEmail, username, amount);
        }
    }, [userEmail, username, amount]);

    const kakaoPay = (useremail, username, amount) => {
        if (window.confirm('구매 하시겠습니까?')) {
            if (true) {
                const today = new Date();
                const makeMerchantUid = today.getHours() + '' + today.getMinutes() + '' +
                        today.getSeconds() + '' + today.getMilliseconds();

                const {IMP} = window;
                IMP.init('imp40415833'); // 가맹점 식별코드
                IMP.request_pay({
                    pg: 'kakaopay.TC0ONETIME', // PG사 코드표에서 선택
                    pay_method: 'card', // 결제 방식
                    merchant_uid: 'IMP' + makeMerchantUid, // 결제 고유 번호
                    name: '상품명', // 제품명
                    amount: amount, // 가격
                    buyer_email: useremail,
                    buyer_name: username
                }, async function (rsp) {
                    if (rsp.success) {
                        console.log(rsp);
                        try {
                            const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/verifyIamport/${rsp.imp_uid}`);
                            if (response.status === 200) {
                                alert('결제 완료!');
                                window.location.reload();
                            } else {
                                alert(`error:[${response.status}]\n결제요청이 승인된 경우 관리자에게 문의바랍니다.`);
                            }
                        } catch (error) {
                            console.error('Error while saving payment to DB:', error);
                            alert('DB 저장 실패');
                        }
                    } else {
                        alert(rsp.error_msg);
                    }
                });
            } else {
                alert('로그인이 필요합니다!');
            }
        }
    };

    return <button id="payment" ref={paymentButtonRef}>payment</button>;
};

export default Payment;
