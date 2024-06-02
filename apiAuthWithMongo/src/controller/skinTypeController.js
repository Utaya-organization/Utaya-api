import SkinType from '../models/skinTypeModel.js';

export const getSkinType = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const skintype = await SkinType.find();
    res.status(200).json(skintype);
}

export const storeSkinType = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);

    const { skinType, productName, urlArticle, urlImage, urlProduct } = req.body;

    const dataSkinType = new SkinType({
        skinType,
        recomendations: {
            productName, 
            urlArticle,
            urlImage, 
            urlProduct,
        }
    });

    try {
        const skintype = await dataSkinType.save();
        res.status(201).json(skintype);
    } catch (error) {
        console.log(error);
    }
}

export const storeProduct = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);

    const { skinType, productName, urlArticle, urlImage, urlProduct } = req.body;
    
    if(skinType === undefined || productName === undefined || urlArticle === undefined || urlImage === undefined || urlProduct === undefined)
        {
        res.status(400).json({
            message: {
                skinType: "require",
                productName: "require",
                urlArticle: "require",
                urlImage: "require",
                urlProduct: "require"
            }
        });
        return;
    }
    
    try {
        const skintype = await SkinType.find({skinType: skinType});
        skintype[0].recomendations.push({
           productName,
           urlArticle,
           urlImage,
           urlProduct
        });
        await skintype[0].save();
        res.status(201).json(skintype);
    } catch (error) {
        console.log(error);
    }
    
    
}

export const destroyProduct = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    
    const { idProduct, skinTypeName } = req.params;
  
    
    const skintype = await SkinType.find({skinType: skinTypeName});
    
    
    try {
        
        const product = skintype[0].recomendations.findIndex(rec=>rec.id === idProduct);
        skintype[0].recomendations.splice(product,1)
        await skintype[0].save()
        console.log(product);
    } catch (error) {
        console.log(error)
    }
}