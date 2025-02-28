const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT||3000;
app.use(express.json());

mongoose.connect(process.env.DB_CONNECT);

const db = mongoose.connection;
db.on('error', (error) => console.error("error",error));
db.once("open",()=>console.log("Connected to Database"));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postRoutes = require('./routes/Post_routes');
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
} ); 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
} );