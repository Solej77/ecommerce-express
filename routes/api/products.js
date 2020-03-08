const express = require('express');
const passport = require("passport");
const ProductsService = require('../../services/products');
const validation = require('../../utils/middlewares/validationHandler');

const { 
  productIdSchema,
  productTagSchema,
  createProductSchema,
  updateProductSchema,
} = require('../../utils/schemas/products')

//JWT strategy
require("../../utils/auth/strategies/jwt");

const productsService = new ProductsService();

// aplicación del patron inversión de control
function productsApi(app) {
  const router = express.Router();
  app.use("/api/products", router);

  router.get('/', async function(req, res, next) {
    const { tags } = req.query;

    try {
      const products = await productsService.getProducts({ tags })
      
      res.status(200).json({
        data: products,
        message: 'products listed'
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:productId', async function(req, res, next) {
    const { productId } = req.params;
    console.log('productId: ', productId)
    console.log('req', req.params);

    try {
      const product = await productsService.getProduct({ productId });
      
      res.status(200).json({
        data: product,
        message: 'products retrieved'
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', validation(createProductSchema), async function(req, res, next) {
    const { body: product } = req;

    try {
      const createdProduct = await productsService.createProduct({ product });

      res.status(201).json({
        data: createdProduct,
        message: 'product created'
      });
    } catch (err) {
      next(err);
    }
  });

  router.put(
    '/:productId',
    passport.authenticate("jwt", { session: false }),
    validation({ productId: productIdSchema }, "params"),
    validation(updateProductSchema),
    async function(req, res, next) {
      const { productId } = req.params;
      const product = req.body;
      console.log('req', req.params);
      console.log('body', product);
    
      try {
        const updatedProduct = await productsService.updateProduct({ productId, product });

        res.status(201).json({
          data: updatedProduct,
          message: 'product updated'
        });
      } catch (err) {
        next(err);
      }
  });

  router.delete(
    '/:productId',
    passport.authenticate("jwt", { session: false }),
    async function(req, res, next){
      const { productId } = req.params;
      console.log('req', req.params);

      try {
        const deletedProduct = await productsService.deleteProduct({ productId });
      
        res.status(200).json({
          data: deletedProduct,
          message: 'product deleted'
        });
      } catch (err) {
        next(err);
      }
  });
}

module.exports = productsApi;
