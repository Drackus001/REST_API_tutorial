const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/orders')


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched(get).'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
    })

    order
    .save()
    .then(result => {
         console.log(result);
         res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error:err})
    })
    
})

// orderID
router.get('/:orderID', (req,res,next) =>{
    const id = req.params.orderID
    if(id === 'SPECIAL'){
        res.status(200).json({
            message: '(SPECIAL) ID found.'
        })
        
    }
    else{
        res.status(201).json({
            message: 'You passed an ID.'
        })
            
    }
    });

router.patch('/', (req,res,next) =>{
    res.status(200).json({
        message: 'order patched'
    })
});

router.delete('/', (req,res,next)=>{
    res.status(200).json({
        message: 'order deleted.'
    })
})
    
    

module.exports = router