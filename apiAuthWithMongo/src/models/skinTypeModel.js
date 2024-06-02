import mongoose, { Types } from "mongoose";

const skinType = mongoose.Schema({
    skinType: {
        type: String,
        require: true,
        unique: true
    },
    recomendations: [{
        productName: {type: String},
        urlArticle: {type: String},
        urlImage: {type: String},
        urlProduct: {type: String}
    }],
});


export default mongoose.model('skinType', skinType);
