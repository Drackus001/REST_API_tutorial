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
                        product: doc.productID,
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
                orderCreated:{
                    _id: result._id,
                    productID: result.product,
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
    if (id === 'SPECIAL') {
        res.status(200).json({
            message: '(SPECIAL) ID found.'
        })

    }
    else {
        res.status(201).json({
            message: 'You passed an ID.'
        })

    }
});

router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: 'order patched'
    })
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'order deleted.'
    })
})



module.exports = router