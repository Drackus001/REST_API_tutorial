const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        messgae: "Handling GET requests to /products"
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        messgae: "Handling POST requests to /products"
    });
});

// productID

router.get('/:productID', (req, res, next) => {
    
    const id = req.params.productID
    if(id === 'special'){
        res.status(200).json({
            message: '(special) ID found.'
        })
        
    }
    else{
        res.status(201).json({
            message: 'You passed an ID.'
        })
            
    }
    
});


router.patch('/', (req, res, next) => {
   res.status(200).json({
       message: 'Updated patch(product)'
   });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted products'
    });
 });

module.exports = router;