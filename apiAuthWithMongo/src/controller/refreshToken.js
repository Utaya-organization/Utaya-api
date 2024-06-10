
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.find({refreshToken: refreshToken});
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const id = user[0].id;
            const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60s'
            });
            res.json({accessToken});
        });
    } catch (error) {
        console.log(error);
    }
}