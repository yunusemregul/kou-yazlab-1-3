var express = require("express");
var app = express();

/*
    bi tane alıcı yapılacak fotoğraf yüklenmesi için
*/

app.get("/", function (req, res) {
    res.send("hello world");
});

app.listen(3000);
