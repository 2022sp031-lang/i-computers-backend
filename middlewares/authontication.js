import jwt from "jsonwebtoken"

export default function authenticateUser(req, res, next) {
    const header = req.header("Authorization");

    if (header != null) {
        const token = header.replace("Bearer ", "");

        jwt.verify(token, "i-computersbatch10",
            (error, decoded) => {
                if (decoded == null) {
                    res.json(
                        {
                            message: "Invalid token please try again!"
                        }
                    )
                } else {
                    req.user = decoded;
                    next()
                }
            }
        )
    } else {
        next()
    }
}