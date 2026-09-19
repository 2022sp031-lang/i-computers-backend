import express from 'express';
import { changePassword, createUser, getUserdata, googleLogin, loginUser, sendOTP, updateUserData, verifyOTPAndPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/', createUser)
userRouter.post('/login', loginUser)
userRouter.get('/me', getUserdata)
userRouter.put('/', updateUserData)
userRouter.put('/password', changePassword)
userRouter.post('/google-login', googleLogin)
userRouter.post('/send-otp', sendOTP)
userRouter.post('/verify-otp', verifyOTPAndPassword)

export default userRouter