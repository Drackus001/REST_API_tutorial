const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/orders')
const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Order
        .find()
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'LIST_OF_ALL_ORDERS',
                count: doc.length,
                orders: doc.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }

                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productID)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'productID not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            })
            ///return order.save()
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order created.',
                orderCreated: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                },

                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + result._id
                }

            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})


// orderID
router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID
    
    Order.findById(id)
        .exec()
        .then(doc => {
            if(!doc._id){
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                message: 'Order available',
                order: {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

});

router.delete('/:orderID', (req, res, next) => {
    const id = req.params.orderID
    
    Order
        .remove({ _id: id })
        .then(doc => {
            if(!doc._id){
                return res.status(404).json({
                    message:'Order not found'
                })
            }
            res.status(200).json({
                message: 'Order deleted.',
                description: `${doc._id} order deleted.`,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/',
                    body: {
                        productID: 'ID',
                        quantity: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

})



module.exports = router