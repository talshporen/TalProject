import express,{Express} from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import post_routes from "./routes/post_routes";
import comments_routes from "./routes/comments_routes";
import auth_routes from "./routes/auth_routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/posts', post_routes);
app.use('/comments', comments_routes);
app.use('/auth', auth_routes);

const options = {
  definition: {
     openapi: "3.0.0",
  info: {
     title: "Web Dev 2025 REST API",
     version: "1.0.0",
      description: "REST server including authentication using JWT",
  },
  servers: [{url: "http://localhost:3000",},],
  },
  apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 

const initApp = async () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on('error',console.error.bind(console,"connection error: "));
    db.once("open",function(){
      console.log("Connected to database");
    });
    if(!process.env.MONGO_URI){
    reject("MONGO_URI is not defined");
    }else{
      mongoose
        .connect(process.env.MONGO_URI)
        .then(()=>{
        resolve(app);
     })
    .catch((error) => {
      reject(error);
    });

    }
  });
};

export default initApp;