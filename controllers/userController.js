import { isObjectIdOrHexString } from "mongoose";
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function createUser(req, res) {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const newUser = new User(
            {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: passwordHash,
            }
        );

        await newUser.save()
        res.json(
            {
                message: "User created successfully!"
            }
        )
    } catch (err) {
        console.log(err)
    }
}

export async function loginUser(req, res) {
    try {
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );

        if (user == null) {
            res.status(404).json(
                {
                    message: "Invalid user!!"
                }
            )
        } else {
            const ispasswordCorrect = await bcrypt.compare(req.body.password, user.password);
            if (ispasswordCorrect) {
               
                const payload = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAdmin: user.isAdmin,
                    isBlocked: user.isBlocked,
                    isEmailVerified: user.isEmailVerified,
                    image: user.image
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "24h"});

                res.json(
                    {
                        token: token,
                        isAdmin: user.isAdmin
                    }
                )

            } else {
                res.status(401).json(
                    {
                        message: "Invalid password!!"
                    }
                )
            }
        }
    } catch (err) {
        res.status(500).json(
            {
                message: "Error logging in"
            }
        )
    }
}