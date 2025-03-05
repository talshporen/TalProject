import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import post_routes from "./routes/post_routes";
import comments_routes from "./routes/comments_routes";
import auth_routes from "./routes/auth_routes";

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
 mongoose
 .connect(process.env.MONGO_URI)
 .then(()=>{
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/posts', post_routes);
  app.use('/comments', comments_routes);
  app.use('/auth', auth_routes);
  resolve(app);
})
.catch((error) => {
  reject(error);
});

}

});
};

export default initApp;