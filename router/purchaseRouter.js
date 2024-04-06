//202135973 백지연

const express = require('express');
var router = express.Router()

var purchase = require('../lib/purchase');

router.get('/detail/:mer_id',(req,res)=>{
    purchase.detail(req,res);
})
router.post('/pay_process',(req,res)=>{
    purchase.pay_process(req,res);
})
router.get('/cart_process/:mer_id',(req,res)=>{
    purchase.cart_process(req,res);
})
router.get('/cancel_process/:purchase_id',(req,res)=>{
    purchase.cancel_process(req,res);
})
router.get('/cart/delete/:cart_id',(req,res)=>{
    purchase.cart_delete(req,res);
})
router.post('/cart_to_purchase',(req,res)=>{
    purchase.cart_to_purchase(req,res);
})
router.get('/cart/add',(req,res)=>{
    purchase.cart_add(req,res);
})
router.get('/purchase/add',(req,res)=>{
    purchase.purchase_add(req,res);
})
router.get('/manager/cart',(req,res)=>{
    purchase.manager_cart(req,res);
})
//----------------------------------
router.get('/manager/cart/update/view',(req,res)=>{
    purchase.cart_update_view(req,res);
})
router.get('/manager/cart/update/:cart_id',(req,res)=>{
    purchase.cart_update(req,res);
})
router.post('/manager/cart/update_process',(req,res)=>{
    purchase.cart_update_process(req,res);
})
//----------------------------------
router.get('/manager/purchase/update/view',(req,res)=>{
    purchase.purchase_update_view(req,res);
})
router.get('/manager/purchase/update/:purchase_id',(req,res)=>{
    purchase.purchase_update(req,res);
})
router.post('/manager/purchase/update_process',(req,res)=>{
    purchase.purchase_update_process(req,res);
})

router.post('/manager/cart_process',(req,res)=>{
    purchase.mcart_process(req,res);
})
router.post('/manager/purchase_process',(req,res)=>{
    purchase.mpurchase_process(req,res);
})
router.get('/manager/purchase',(req,res)=>{
    purchase.manager_purchase(req,res);
})
router.get(`/`,(req,res)=>{
    purchase.purchase_view(req,res);
})
router.get('/cart',(req,res)=>{
    purchase.cart_view(req,res);
})



module.exports = router;