const express = require('express');
const {
    getViews,
    createViews

} = require('../controllers/userViews');



const router = express.Router();

const { protect} = require('../middleware/auth');
//todo: remove authorize from middleware




router
    .route('/:productId')
    .post(protect, createViews)
    .get(protect, getViews);

module.exports = router;
