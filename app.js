const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

const port = process.env.PORT;

const postRoutes = require('./routes/Post_routes');
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
} ); 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
} );