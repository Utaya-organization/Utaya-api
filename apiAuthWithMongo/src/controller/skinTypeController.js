
import Firestore from '@google-cloud/firestore';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Storage } from "@google-cloud/storage";
import admin from 'firebase-admin';
import express from "express";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config/token.js';
import predictClassification from '../../services/inferenceService.js';

const app = express();

admin.initializeApp();

const storage = new Storage();
const bucketName = 'utaya-bucket-capstone'
const bucket = storage.bucket(bucketName)





const db = new Firestore();

export const isAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.userName = decoded.userName;
        const userName = decoded.userName;
        
        const userCollection = db.collection('users');
        // const userDocRef = userCollection.doc(userName);
        const user = await admin.firestore().collection('users').doc(userName).get();
        const isAdmin = user.data().isAdmin;
        if(!isAdmin) return res.sendStatus(403);
        next();
        
    })
}


export const getSkinType = async (req, res) => {


    try {
        // Mendapatkan semua dokumen dari koleksi 'skinTypes'
        const snapshot = await admin.firestore().collection('skinTypes').get();

        // Mengumpulkan data dari setiap dokumen
        const skinTypes = [];
        snapshot.forEach(doc => {
            skinTypes.push({
                id: doc.id,
                data: doc.data()
            });
        });

        // Mengirimkan data sebagai respons JSON
        res.status(200).json(skinTypes);
    } catch (error) {
        console.error('Error fetching skin types:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const storeSkinType = async (req, res) => {
    const { skinType, productName, urlArticle, urlProduct } = req.body;
    const file = req.file; // Mengambil file gambar dari permintaan

    if(skinType === undefined || productName === undefined || urlArticle === undefined || urlProduct === undefined || file === undefined) return res.status(400).json({
        meassage: {
            skinType: 'require',
            productName: 'require',
            urlArticle: 'require',
            urlProduct: 'require',
            file: 'require'
        }
    }); 
    const skinTypesCollection = db.collection('skinTypes');
    const skinTypeDocRef = skinTypesCollection.doc(skinType);

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const folderName = 'img-ss';
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;

    // Convert this to blob
    const blob = bucket.file(fileName);
    const blobstream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    blobstream.on('error', (err) => {
        console.error('Blob stream error:', err);
        return res.status(500).send('File upload error');
    });

    blobstream.on('finish', async () => {
        // Construct the public URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        try {
            // Assuming skinTypeDocRef is already defined and points to the correct Firestore document
            await skinTypeDocRef.set({
                skinType,
                recommendations: [{
                    id: db.collection('skinTypes').doc().id,
                    productName,
                    urlArticle,
                    urlImage: imageUrl,
                    urlProduct,
                }],
            });

            res.sendStatus(201);
        } catch (error) {
            console.error('Error storing skin type:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    // End the blob stream with the file buffer
    blobstream.end(file.buffer);

    
};

export const storeProduct = async (req, res) => {

    const { skinType, productName, urlArticle, urlProduct } = req.body;
    const file = req.file; // Mengambil file gambar dari permintaan
    // Pastikan semua field tersedia
    if (!skinType || !productName || !urlArticle || !urlProduct) {

        return res.status(400).json({
            message: {
                skinType: "required",
                productName: "required",
                urlArticle: "required",
                urlImage: "required",
                urlProduct: "required"
            }
        });
    }

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const folderName = 'img-ss';
    const fileName = `${folderName}/${Date.now()}-${file.originalname}`;

    // Convert this to blob
    const blob = bucket.file(fileName);
    const blobstream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
    });

    blobstream.on('error', (err) => {
        console.error('Blob stream error:', err);
        return res.status(500).send('File upload error');
    });

    blobstream.on('finish', async () => {
        // Construct the public URL
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        
    try {
        // Mendefinisikan referensi dokumen dalam koleksi 'skinTypes' berdasarkan ID `skinType`
        const skinTypeDocRef = db.collection('skinTypes').doc(skinType);
        

        // Menambahkan data baru ke dalam bidang recommendations yang sudah ada, tanpa menggantinya
        await skinTypeDocRef.update({
            recommendations: admin.firestore.FieldValue.arrayUnion({
                id: db.collection('skinTypes').doc().id,
                productName,
                urlArticle,
                urlImage: imageUrl,
                urlProduct,
            })
        });

        // Berikan respons berhasil
        res.sendStatus(201);
    } catch (error) {
        console.error('Error storing product:', error);
        res.status(500).send('Internal Server Error');
    }
})
blobstream.end(file.buffer);

  

}

export const destroyProduct = async (req, res) => {
    const { idProduct, skinTypeName } = req.params;

    try {
        // Mendapatkan referensi dokumen dalam koleksi 'skinTypes' berdasarkan nama jenis kulit
        const skinTypeDocRef = admin.firestore().collection('skinTypes').doc(skinTypeName);

        // Mendapatkan data dokumen
        const doc = await skinTypeDocRef.get();

        // Memeriksa apakah dokumen ditemukan
        if (!doc.exists) {
            return res.status(404).json({ message: 'Skin type not found' });
        }

        // Mendapatkan data dokumen
        const skinTypeData = doc.data();

        // Mendapatkan indeks produk dalam array recommendations
        const productIndex = skinTypeData.recommendations.findIndex(rec => rec.id === idProduct);

        // Memeriksa apakah produk ditemukan dalam recommendations
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in recommendations' });
        }

        const product = skinTypeData.recommendations[productIndex];
        const imageUrl = product.urlImage;
        const filePath = imageUrl.split(`${bucket.name}/`).pop();


        const file = bucket.file(filePath);
        await file.delete();



        // Menghapus produk dari array recommendations
        skinTypeData.recommendations.splice(productIndex, 1);

        //delete bucket
        

        // Memperbarui dokumen dengan data yang sudah diperbarui
        await skinTypeDocRef.update({ recommendations: skinTypeData.recommendations });

        // Berikan respons berhasil
        res.status(200).json({ message: 'Product deleted from recommendations' });
    } catch (error) {
        console.error('Error deleting product from recommendations:', error);
        res.status(500).send('Internal Server Error');
    }
}


export const getUserLogin = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
  

    try {
        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            res.status(404).json({ message: 'No matching documents.' });
            return;
        }

        const user = [];
        snapshot.forEach(doc => {
            user.push({
                id: doc.id,
                username: doc.data().username
            });
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error getting documents', error });
    }
}

export const registerUser = async (req, res) => {
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

    //check confirm password
    if(password !== confirmPassword ) {
        res.status(400).json({
            message: "password and confirm password not the same"
        });
        return;
    }
    const userCollection = db.collection('users');
    const userDocRef = userCollection.doc(username);

    const user = await admin.firestore().collection('users').doc(username).get();
    if(user.data() !== undefined) return res.status(400).json({message: 'username alredy exists'})
    

    const isAdmin = false;
    const isDelete = false;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const deletedAt = null;
    const refreshToken = null;

     //password hash
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await userDocRef.set({
            username,
            password: hashPassword,
            refreshToken,
            isAdmin,
            isDelete,
            createdAt,
            updatedAt,
            deletedAt,
            history: {}
        });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if(username === undefined || password === undefined) return res.status(400).json({message: {username: "require", password: "require"}});
    const user = await admin.firestore().collection('users').doc(username).get();
    const isDelete = user.data().isDelete;
    
    if(isDelete) return res.status(403).json({message: 'your account has been deleted'});
    if(user.data() === undefined) return res.status(404).json({message: 'username not found'});
    const match = await bcrypt.compare(password, user.data().password);
    if(!match) return res.status(404).json({message: 'wrong password'});

    const userName = user.data().username;
    const accessToken = jwt.sign({userName}, ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    const refreshToken = jwt.sign({userName}, REFRESH_TOKEN_SECRET,{
        expiresIn: '1d'
    });
    const userDocRef = db.collection('users').doc(username);
    try {
        await userDocRef.update({
            refreshToken
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({accessToken});
    } catch (error) {
        console.log(error);
    }
}

export const updatePassword = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const { password, newPassword, confirmNewPassword } = req.body;
    if(password === undefined || newPassword === undefined || confirmNewPassword === undefined) return res.status(400).json({message: {password: "require", newPassword: "require", confirmNewPassword: "require"}});

    try {
        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            res.status(404).json({ message: 'No matching documents.' });
            return;
        }

        const user = [];
        snapshot.forEach(doc => {
            user.push({
                id: doc.id,
                username: doc.data().username,
                password: doc.data().password
            });
        });

        const userName = user[0].username;
        const match = await bcrypt.compare(password, user[0].password);

        if(!match) return res.status(400).json({message: 'wrong password'});

        const confirmMatch = newPassword == confirmNewPassword;

        if(!confirmMatch) return res.status(400).json({message: 'password not the same'});

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);
        const updatedAt = new Date().toISOString();

        const userDocRef = db.collection('users').doc(userName);

        try {
            await userDocRef.update({
                password: hashPassword,
                updatedAt
            });
            res.status(200).json({message: 'password has been updated'});
        } catch (error) {
            console.log(error);
        }
    

    } catch (error) {
        res.status(500).json({ message: 'Error getting documents', error });
    }
}

export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    try {
        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            res.status(404).json({ message: 'No matching documents.' });
            return;
        }

        const user = [];
        snapshot.forEach(doc => {
            user.push({
                id: doc.id,
                username: doc.data().username
            });
        });

        const userName = user[0].username;
        const userDocRef = db.collection('users').doc(userName);
        try {
            await userDocRef.update({
                refreshToken: null
            });
            res.clearCookie('refreshToken');
            res.status(200).json({message: 'logout success'});
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    try {
        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            res.status(404).json({ message: 'No matching documents.' });
            return;
        }

        const user = [];
        snapshot.forEach(doc => {
            user.push({
                id: doc.id,
                username: doc.data().username,
                password: doc.data().password
            });
        });

        const userName = user[0].username;
        const deletedAt = new Date().toISOString();
        const userDocRef = db.collection('users').doc(userName);

        try {
            await userDocRef.update({
                isDelete: true,
                deletedAt,
                refreshToken: null
            });
            res.clearCookie('refreshToken');
            res.status(200).json({meassage: "account has been deleted"});
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

export const addHistorys = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    try {

        const image = req.file.buffer;
        const model = req.app.locals.model;
        const {prediction, highestPrediction, label } = await predictClassification(model, image);

        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

       
        const skinTypeDocRef = await admin.firestore().collection('skinTypes').doc(label).get();
        const recommendations = skinTypeDocRef.data().recommendations;
      
         if (snapshot.empty) {
                res.status(404).json({ message: 'No matching documents.' });
                return;
            }
    
            const user = [];
            snapshot.forEach(doc => {
                user.push({
                    id: doc.id,
                    username: doc.data().username,
                    password: doc.data().password
                });
            });
    
            const userName = user[0].username;
          
            const userDocRef = db.collection('users').doc(userName);
             try {
                await userDocRef.update({
                    history: admin.firestore.FieldValue.arrayUnion({
                        id: db.collection('users').doc().id,
                        skinType: label,
                        skinTpypePercentation: highestPrediction,
                        recommendations: recommendations
                    })
                });
                res.status(200).json({message: 'success',
                    skinType: label,
                    skinTpypePercentation: highestPrediction,
                    recommendations: recommendations
                });
             } catch (error) {
                
             }
       


        
        return
        
       

    } catch (error) {
        console.log(error);
    }

   
    
    
   
    // const {}
    
}

export const getHistory = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);

    try {

        const usersRef = await admin.firestore().collection('users');
        const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

        if (snapshot.empty) {
            res.status(404).json({ message: 'No matching documents.' });
            return;
        }

        const user = [];
        snapshot.forEach(doc => {
            user.push({
                id: doc.id,
                username: doc.data().username
            });
        });

        const userDocRef = await admin.firestore().collection('users').doc(user[0].username).get();
       
        const historys = userDocRef.data().history;

        res.status(200).json({historys});
        
    } catch (error) {
        console.log(error)
    }
}

export const addHistory = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(403);
    const {skinType} = req.params;
 
    try {

        const usersRef = await admin.firestore().collection('users');
                const snapshot = await usersRef.where('refreshToken', '==', refreshToken).get();

               
                const skinTypeDocRef = await admin.firestore().collection('skinTypes').doc(skinType).get();
                const recommendations = skinTypeDocRef.data().recommendations;

                if (snapshot.empty) {
                    res.status(404).json({ message: 'No matching documents.' });
                    return;
                }
        
                const user = [];
                snapshot.forEach(doc => {
                    user.push({
                        id: doc.id,
                        username: doc.data().username
                    });
                });
        
                const userName = user[0].username;
              
                const userDocRef = db.collection('users').doc(userName);
                console.log(userDocRef)
                try {

                    await userDocRef.update({
                        history: admin.firestore.FieldValue.arrayUnion({
                            id: db.collection('users').doc().id,
                            skinType: skinType,
                            recommendations: recommendations
                        })
                    });
                    res.status(200).json({message: 'success'});
                    
                } catch (error) {
                    console.log(error)
                }
        
    } catch (error) {
        console.log(error);
    }
}