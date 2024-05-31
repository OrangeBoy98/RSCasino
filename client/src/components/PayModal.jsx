import React, { useState } from 'react';
import Payment from './Payment';

import '../css/paymodal.css';

const PayModal = ({ setModal, userEmail, username }) => {
    const [payMoney, setPayMoney] = useState();
    const [viewMoney, setViewMoney] = useState();
    //console.log(payMoney);

    const handleChange = (e) => {
        setPayMoney(e.target.value);
        const value = e.target.value.replace(/,/g, ''); // Remove commas
        if (!isNaN(value) && value !== '') {
            setViewMoney(Number(value).toLocaleString());
        } else if (value === '') {
            setViewMoney('');
        }
    }

    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <h1>ModalTest</h1>
                <label>결제하실 금액을 입력해주세요</label>
                <input type="text" onChange={handleChange} value={viewMoney}/>
                <Payment userEmail={userEmail} username={username} amount={payMoney} />
                <button onClick={() => setModal(false)}>close</button>
            </div>
        </div>
    )
}

export default PayModal;
