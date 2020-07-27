const express = require('express');
const {
    getProduct,
    getProducts,
    createProduct,
    deleteProduct
} = require('../controllers/products');



const router = express.Router();

const { protect} = require('../middleware/auth');
//todo: remove authorize from middleware



router
    .route('/')
    .get(protect, getProducts)
    .post(protect,createProduct);

router
    .route('/:id')
    .get(getProduct)
    .delete(protect,deleteProduct);

module.exports = router;
