const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        amount: {
            type: Number,
            required: [true, 'Please add amount']
        }
    }
);


module.exports = mongoose.model('Product', ProductSchema);
