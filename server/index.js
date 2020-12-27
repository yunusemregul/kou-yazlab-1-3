var express = require("express");
var bodyParser = require("body-parser");
var app = express();

/*
    bi tane alıcı yapılacak fotoğraf yüklenmesi için
*/

app.get("/", function (req, res) {
    res.send("hello world");
});

app.post("/upload", bodyParser.json(), function (req, res) {
   
    console.log(req.body);
})

app.listen(3000);
