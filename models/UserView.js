
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const UserViewSchema = new mongoose.Schema(
    {
        userId:{
            type: ObjectId,
            required: true,
            ref: 'User'
        },
        viewDate: {
            type: Date,
            default: Date.now
        },
        productId:{
            type: ObjectId,
            required: true,
            ref: 'Product'
        }


    }
);


module.exports = mongoose.model('UserView', UserViewSchema);

