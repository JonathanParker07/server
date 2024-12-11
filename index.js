import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/userRoute.js"

const app = express();
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 9000;
const MONGOURL = process.env.MONGO_URL;

mongoose
    .connect(MONGOURL)
    .then(()=>{
            console.log("DB connected succesfully")
            app.listen(PORT,()=>{
                console.log(`Server is running on port: ${PORT}`);

            });
    })
    .catch((errror) => console.log(errror));

    app.use("/api", route)