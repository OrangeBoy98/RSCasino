import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true,},
        email: {type: String, required: true, unique: true,},
        img: {type: String,},
        phone: {type: String, required: true,},
        password: {type: String, required: true,},
        isAdmin: {type: Boolean, default: false,},
        money: {type: Number, default: 1000,}
    },
    {timestamps: true}
);

export default mongoose.model('User', UserSchema);