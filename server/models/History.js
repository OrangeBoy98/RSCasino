import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    result: {
        type: Number,
        required: true
    },
    betType: {
        type: String,
        required: true
    }
}, { timestamps: true });

const History = mongoose.model('History', HistorySchema);
export default History;
