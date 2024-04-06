//202135973 백지연
const express = require('express');
var router = express.Router()
var auth = require('../lib/auth');
router.get('/login',(req, res)=>{
    auth.login(req, res);
});
router.post('/login_process',(req, res)=>{
    auth.login_process(req, res);
});
router.get('/logout_process',(req,res)=>{
    auth.logout_process(req,res);
});
router.get('/join',(req,res)=>{
    auth.join(req,res)
})
router.post('/join_process',(req,res)=>{
    auth.join_process(req,res)
})
module.exports = router;