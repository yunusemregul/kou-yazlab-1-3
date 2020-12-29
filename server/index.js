var express = require("express");
var bodyParser = require("body-parser");
const vision = require("@google-cloud/vision");

var app = express();

const client = new vision.ImageAnnotatorClient({
     keyFilename: "apikey.json",
});

/*
    bi tane alıcı yapılacak fotoğraf yüklenmesi için
*/

app.get("/", function (req, res) {
     res.send("hello world");
});

const jsonParser = bodyParser.json({ limit: "50mb" });

app.post("/upload", jsonParser, async function (req, res) {
     const base64 = req.body.img;

     const request = {
          image: {
               content: Buffer.from(base64, "base64"),
          },
     };

     const [result] = await client.objectLocalization(request);
     
});

app.listen(3000);
