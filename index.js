const express = require('express');
const path = require('path');
const app = express();
const productosRouter = require('./routes/products');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/products", productosRouter);

const server = app.listen(8000, function(){
  console.log(`Listening http://localhost:${server.address().port}`);
});