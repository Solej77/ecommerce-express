const express = require('express');
const router = express.Router();
const productMocks = require('../utils/mocks/products');

router.get("/", function(req, res, next){
  res.render("products", { products });
});

module.exports = router;
