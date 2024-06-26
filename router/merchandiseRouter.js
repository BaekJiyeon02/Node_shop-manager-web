//202135973 백지연

const express = require('express');
var router = express.Router()

var merchandise = require('../lib/merchandise');
const multer = require('multer');


// 파일 upload
const upload = multer({
    storage: multer.diskStorage({
              destination: function (req, file, cb) { cb(null, 'public/images');  },
              filename: function (req, file, cb) {
                      var newFileName = file.originalname
                      cb(null, newFileName); }
             }),
    });
router.get('/view/:vu',(req, res)=>{
    merchandise.view(req, res);
}); 

router.get('/create',(req,res)=>{
    merchandise.create(req,res);
})

//상품 생성 처리
router.post('/create_process',upload.single('uploadFile'),(req,res)=>{
    if(req.file === undefined) {file = 'No'}
    else file = '/images/' + req.file.filename
    merchandise.create_process(req,res,file);
})

router.get('/update/:merId',(req,res)=>{
    merchandise.update(req,res);
    
})
router.post('/update_process',upload.single('uploadFile'),(req,res)=>{
    var file = ''
    if(req.file === undefined) {file = 'No'}
    else file = '/images/' + req.file.filename

    merchandise.update_process(req,res,file);
})

router.get('/delete/:merId',(req,res)=>{
    merchandise.delete_process(req,res);
})

module.exports = router;

