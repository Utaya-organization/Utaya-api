import express from "express";

import cors from "cors";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";




const app = express();


dotenv.config();



  

app.use(express.json());

app.use(cors({credentials:true, origin:'*'}));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))



app.use(userRoute);


app.listen(3000, ()=> console.log('server running'));