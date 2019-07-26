const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched(get).'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message:'Order was created(post).'
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