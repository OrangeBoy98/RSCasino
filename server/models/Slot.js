import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
    roundNumber: { type: Number, required: true },
    bets: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
    }],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export default mongoose.model('Slot', SlotSchema);
