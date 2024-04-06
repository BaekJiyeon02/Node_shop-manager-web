//202135973 백지연
const express = require('express');
var router = express.Router()

var board = require('../lib/board');

router.get('/type/view',(req, res)=>{
    board.type_view(req, res);
}); 

router.get('/type/create',(req,res)=>{
    board.type_create(req,res);
})

router.post('/type/create_process',(req,res)=>{
    board.type_create_process(req,res);
})

router.get('/type/update/:type_id',(req,res)=>{
    board.type_update(req,res);
})
router.post('/type/update_process',(req,res)=>{
    board.type_update_process(req,res);
})

router.get('/type/delete/:type_id',(req,res)=>{
    board.type_delete_process(req,res);
})

router.get('/view/:type_id/:pNum',(req,res)=>{
    board.view(req,res);
})

router.get('/create/:type_id',(req,res)=>{
    board.create(req, res);
})

router.post('/create_process',(req,res)=>{
    board.create_process(req,res);
})

router.get('/update/:type_id/:board_id',(req,res)=>{
    board.update(req, res);
})

router.post('/update_process',(req,res)=>{
    board.update_process(req,res);
})

router.get('/detail/:board_id/:type_id',(req,res)=>{
    board.detail(req,res);
})

router.get('/delete/:type_id/:board_id',(req,res)=>{
    board.delete_process(req,res);
})

module.exports = router;

