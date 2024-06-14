import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const decryptData = (req, res, next) => {
    if (req.body.data) {
        //console.log(req.body.data);
        try {
            const bytes = CryptoJS.AES.decrypt(req.body.data, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            req.body = decryptedData;
        } catch (e) {
            return res.status(400).json({ message: 'Invalid data' });
        }
    }
    next();
};
