//202135973 백지연
const express = require('express');
var router = express.Router()

var shop = require('../lib/shop');

router.get('/all',(req, res)=>{
    shop.home(req, res);
}); 
router.post('/search',(req,res)=>{
    shop.search(req, res);
})

router.get('/detail/:mer_id',(req, res)=>{
    shop.detail(req, res);
}); 

router.get('/view/:sub_id',(req, res)=>{
    shop.view(req, res);
}); 

router.get('/anal/customer',(req, res)=>{
    shop.customeranal(req, res);
}); 
router.get('/cart/customer',(req, res)=>{
    shop.customercart(req, res);
}); 

module.exports = router;

