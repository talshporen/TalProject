import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from 'body-parser';

import postRoutes from "./routes/post_routes";

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on('error', (error) =>{
       console.error(error);
    });
    db.once("open",()=>{
      console.log("Connected to mongoDB");
    });

if(process.env.MONGO_URI===undefined){
  console.error("MONGO_URI is not set");
  reject();
}else{
 mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("initApp finish");


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

 
  app.use('/posts', postRoutes);
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  resolve(app);
});
}
});
};

export default initApp;