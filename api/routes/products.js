const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
        //accepts a file
        cb(null, true)
    } else {
        //reject a file
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // accepts upto 5 mb
    },
    fileFilter: fileFilter
    })

const Product = require('../models/product');


router.get('/', (req, res, next) => {
    Product
        .find()
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            const response = {
                count: doc.length,
                products: doc.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: 'http://localhost:3000/'+  doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }

            //console.log(doc)

            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Created product Successfully",
                products: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    productImage:'http://localhost:3000/'+  product.productImage,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + product._id
                    }
                }
            });
        })
        .catch(err => {
            console.log('error');
            res.status(500).json({ error: err });
        });

});

// productID

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID
    // console.log(req.file.path)
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from database", doc);

            if (doc) {
                res.status(200).json({
                    message: 'element available',
                    product: {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: 'http://localhost:3000/'+  doc.productImage

                    },
                    request: {
                        type: 'GET',
                        description: 'ALL_PRODUCT_LIST',
                        url: 'http://localhost:3000/products/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Element Not Found'
                });
            }

        })
        .catch(error => {
            console.log("error:" + error)
            res.status(500).json({ err: error })
        })
});


router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product
        .update({ _id: id }, { $set: updateOps })
        .exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json({
                message: 'Product Updated...',
                updated: { updateOps },
                request: {
                    type: 'GET',
                    description: 'see updated product',
                    url: 'http://localhost:3000/product/' + id
                }

            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID
    Product
        .remove({ _id: id })
        .then(doc => {
            res.status(200).json({
                message: 'Product deleted.',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products'
                },
                body: {
                    name: "String",
                    price: "Number"
                }

            })
            console.log(doc)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

module.exports = router;