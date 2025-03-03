const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/Post_routes');

const db = mongoose.connection;
db.on('error', (error) => console.error("error",error));
db.once("open",()=>console.log("Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

const initApp = ()=> {
  return new Promise(async (resolve,reject) => {
    await mongoose.connect(process.env.DB_CONNECT);
    resolve (app);
  });
};

module.exports = initApp;