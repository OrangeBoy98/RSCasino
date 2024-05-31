import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    imp_uid: { type: String, required: true },
    merchant_uid: { type: String, required: true },
    amount: { type: Number, required: true },
    buyer_email: { type: String, required: true },
    buyer_name: { type: String, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
