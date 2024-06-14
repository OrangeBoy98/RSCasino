import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const verifyToken = (req, res, next, callBack) => {
    const token = req.headers['access_token'];
    console.log(`verifying token: ${token}`);
    if (!token) {
        return next(createError(401, 'You are not authorized'));
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            console.error('Token verification error:', err); // 에러 로그 추가
            return next(createError(403, 'Token is not valid'));
        }
        req.user = user;
        console.log('Token payload:', user); // 토큰 페이로드 로그 추가
        if (callBack) callBack();
        else next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, async () => {
        console.log('User ID from token:', req.user.id); // 로그 추가
        console.log('User ID from params:', req.params.id); // 로그 추가
        console.log('User isAdmin from token:', req.user.isAdmin); // 로그 추가
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, 'You are not authorized'));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, async () => {
        if(req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, 'You are not authorized'));
        }
    });
};
