import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/token.js";


export const Auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.userName = decoded.userName;
        next();
    })
}