import SkinType from '../models/skinTypeModel.js';
import Firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = 'utaya-bucket'
const bucket = storage.bucket(bucketName)



admin.initializeApp();

const db = new Firestore();


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

    // const refreshToken = req.cookies.refreshToken;
    // if(!refreshToken) return res.sendStatus(403);

    // const { skinType, productName, urlArticle, urlImage, urlProduct } = req.body;

    // const dataSkinType = new SkinType({
    //     skinType,
    //     recomendations: {
    //         productName, 
    //         urlArticle,
    //         urlImage, 
    //         urlProduct,
    //     }
    // });

    // try {
    //     const skintype = await dataSkinType.save();
    //     res.status(201).json(skintype);
    // } catch (error) {
    //     console.log(error);
    // }
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

    // const refreshToken = req.cookies.refreshToken;
    // if(!refreshToken) return res.sendStatus(403);

    // const { skinType, productName, urlArticle, urlImage, urlProduct } = req.body;

    // if(skinType === undefined || productName === undefined || urlArticle === undefined || urlImage === undefined || urlProduct === undefined)
    //     {
    //     res.status(400).json({
    //         message: {
    //             skinType: "require",
    //             productName: "require",
    //             urlArticle: "require",
    //             urlImage: "require",
    //             urlProduct: "require"
    //         }
    //     });
    //     return;
    // }

    // try {
    //     const skintype = await SkinType.find({skinType: skinType});
    //     skintype[0].recomendations.push({
    //        productName,
    //        urlArticle,
    //        urlImage,
    //        urlProduct
    //     });
    //     await skintype[0].save();
    //     res.status(201).json(skintype);
    // } catch (error) {
    //     console.log(error);
    // }


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
