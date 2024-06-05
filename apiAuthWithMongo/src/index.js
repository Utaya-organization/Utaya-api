import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import loadModel from "../services/loadModel.js";



const app = express();
// const initModel = async () => {
//     try {
//         const model = await loadModel();
//         app.locals.model = model;
//         console.log(model);
//     } catch (error) {
//         console.error('Gagal memuat model:', error);
//     }
// };

// initModel();

app.get('/predict', async (req, res) => {
    if (!app.locals.model) {
        return res.status(500).send('Model belum dimuat');
    }

    // Logika prediksi akan ditambahkan di sini
    // const prediction = app.locals.model.predict(tensor);

    res.send('Prediction result');
});

dotenv.config();



  

app.use(express.json());

app.use(cors({credentials:true, origin:'*'}));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))



app.use(userRoute);


app.listen(3000, ()=> console.log('server running'));