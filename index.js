const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const tesseract = require("node-tesseract-ocr");

app.use(express.static(path.join(__dirname + '/uploads')));
app.set('view engine',"ejs");
app.get('/', (req,res) => {
    res.render('index', {data : ''});
});

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null , "/uploads");
    },
    filename: function(req, file, cb){
        cb( null , file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({storage:storage});

app.post('/extracttextforimage',upload.single('file'), (req,res) => {
    const config = {
        lang : "eng",
        oem: 1,
        psm: 3,
    }
    tesseract.recognize(req.file.path, config)
    .then ((text) => {
        console.log(text);
        res.render('index', {data : text});
    })
    .catch((error) => {
        console.log(error);
    });
});

app.listen(5500, () => {
    console.log(`listening on port 7000`);
});
