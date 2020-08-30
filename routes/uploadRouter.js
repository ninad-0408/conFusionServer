const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/))
    {
        return cb(new Error("You can upload only images..."), null);
    }
    return cb(null, true);
}

const upload = multer({ storage: storage , fileFilter: imageFileFilter});


const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /dishes');
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /dishes');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile') , (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('ContentType', 'application/json');
    res.json(req.file);
})

module.exports = uploadRouter;