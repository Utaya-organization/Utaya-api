import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Firestore from '@google-cloud/firestore';


const db = new Firestore();


export const GetUserLogin = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const user = await User.find({refreshToken: refreshToken}).select({username: 1});
    res.status(200).json(user);
   
}

export const storeUsers = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    //check field
    if(username === undefined || password === undefined || confirmPassword === undefined) {
        res.status(400).json({
            message: {
                username: "require",
                password: "require",
                confirmPassword: "require"
            }
        });
        return;
    }





    // //check username uniq
    // const checkUsername = await User.find({username: username});
    // if(checkUsername[0] !== undefined) {
    //     res.status(400).json({
    //         message: "username alredy exists"
    //     });
    //     return;
    // }

    // //check confirm password
    // if(password !== confirmPassword ) {
    //     res.status(400).json({
    //         message: "password and confirm password not the same"
    //     });
    //     return;
    // }
    // const createdAt = new Date().toISOString();
    // const updatedAt = createdAt;
    // const deletedAt = null;
    // const refreshToken = null;
    

    // //password hash
    // const salt = await bcrypt.genSalt();
    // const hashPassword = await bcrypt.hash(password, salt);
    
    // const user = new User({
    //     username, 
    //     password: hashPassword, 
    //     refreshToken,
    //     createdAt, 
    //     updatedAt,
    //     deletedAt
    // });
   
    // try {
    //     const saveUser = await user.save();
    //     res.status(201).json(saveUser);
    // } catch (error) {
    //     res.status(400).json({meassage: error.meassage});
    // }
}

export const LoginUsers = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.find({username: username});

    if(username === undefined || password === undefined) return res.status(400).json({message: {username: "require", password: "require"}});
   

    if(user[0] === undefined ) return res.status(404).json({message: 'username not found'});
    if(user[0].isDelete === true) return res.status(403).json({message: 'your account has been deleted'});

    const match = await bcrypt.compare(password, user[0].password);

    if(!match) return res.status(400).json({message: "wrong password"});
    
    const id = user[0].id;
    const userName = user[0].username;
    const accessToken = jwt.sign({id, userName}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s'
    });
    const refreshToken = jwt.sign({id, userName}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: '1d'
    });
    
    await User.updateOne({
        _id: id
    },
    {
        refreshToken: refreshToken
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.json({accessToken});


}

export const UpdatePassword = async (req, res) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    if(password === undefined || newPassword === undefined || confirmNewPassword === undefined) return res.status(400).json({message: {password: "require", newPassword: "require", confirmNewPassword: "require"}});
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const user = await User.find({refreshToken: refreshToken});
    const idUser = user[0].id;
    const match = await bcrypt.compare(password, user[0].password);
    
    if(!match) return res.status(400).json({message: 'wrong password'});

    const confirmMatch = newPassword == confirmNewPassword;

    if(!confirmMatch) return res.status(400).json({message: 'password not the same'});

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updatedAt = new Date().toISOString();

    await User.updateOne({
                _id: idUser
            },
            {
                password: hashPassword,
                updatedAt
            });
    
    res.status(200).json({meassage: 'password has been update'});
}

export const logoutUsers = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await User.find({refreshToken: refreshToken});
    if(!user[0]) return res.sendStatus(204);
    const idUser = user[0].id;
    await User.updateOne({
        _id: idUser
    },
    {
        refreshToken: null
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const deleteUsers = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const user = await User.find({refreshToken: refreshToken});
    const idUser = user[0].id;
    const deletedAt = new Date().toISOString();

        await User.updateOne({
            _id: idUser
        },
        {
            isDelete: true,
            refreshToken: null,
            deletedAt
        });
    res.clearCookie('refreshToken');
    res.status(200).json({meassage: "account has been deleted"});
}

export const getAllUsers = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const users = await User.find().select({username: 1, isAdmin: 1, isDelete: 1});
    res.status(200).json(users);
}

