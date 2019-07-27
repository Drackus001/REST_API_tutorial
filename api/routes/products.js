const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');


router.get('/', (req, res, next) => {
    Product
    .find()
    .select("name price _id")
    .exec()
    .then( doc =>{
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request:{
                        type:'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }

        //console.log(doc)
        
        res.status(200).json(response)
    })
    .catch( err =>{
        console.log(err)
        res.status(500).json({error:err})
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product
    .save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "Handling POST requests to /products",
            products: product
        });
    })
    .catch(err => {
        console.log('error');
        res.status(500).json({error: err });
    });
    
});

// productID

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID
    Product.findById(id)
    .exec()
    .then( doc =>{
        console.log("from database", doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: 'Element Not Found'
            });
        }
        
    })
    .catch( error => {
        console.log("error:"+error)
        res.status(500).json({err:error})
    })
});


router.patch('/:productID', (req, res, next) => {
   const id = req.params.productID
   const updateOps ={}
   for(const ops of req.body){
       updateOps[ops.propName]= ops.value;
   }
   Product
   .update({ _id:id }, {$set:updateOps})
   .exec()
   .then( doc => {
       console.log(doc)
       res.status(200).json(doc)
   })
   .catch( err => {
       console.log(err)
       res.status(500).json({error:err})
   })
    
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID
    Product
    .remove({ _id:id })
    .then(doc => {
        res.status(200).json({doc})
        console.log(doc)
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({error:err})
    })
 });

module.exports = router;