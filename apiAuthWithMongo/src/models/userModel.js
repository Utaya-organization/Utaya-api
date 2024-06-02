import mongoose, { Types } from "mongoose";

const User = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        required: true
    },
    isDelete:{
        type: Boolean,
        default: false
    },
    refreshToken:{
        type: String,
        required: false
    },
    createdAt:{
        type: String,
        required: false
    },
    updatedAt:{
        type: String,
        required: false
    },
    deletedAt:{
        type: String,
        required: false
    }
});

export default mongoose.model('Users', User);