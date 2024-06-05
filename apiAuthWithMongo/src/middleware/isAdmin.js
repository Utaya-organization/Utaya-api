import jwt from "jsonwebtoken";
// import User from "../models/userModel.js"


export const isAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.id = decoded.id;
        const idUser = decoded.id;
        const user = await User.find({_id: idUser});
        if(!user[0].isAdmin) return res.sendStatus(403)
        next();
    })
}