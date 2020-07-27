const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');


exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: product });
});
exports.getProducts = asyncHandler(async (req, res, next) => {
    const params = {sort:{}, searchParams:{}};
   const products = await Product.find(params.searchParams).sort(params.sort);
   res.status(200).json({ success: true, data: products });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
   let productBody = req.body;

    const product = await Product.create(productBody);

    res.status(201).json({
        success: true,
        data: product
    });
});


exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }


    await product.remove();

    res.status(200).json({ success: true, data: {} });
});
