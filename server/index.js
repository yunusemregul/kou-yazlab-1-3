var express = require("express");
var bodyParser = require("body-parser");
var vision = require("@google-cloud/vision");
var { createCanvas, loadImage } = require("canvas");
var fs = require("fs");
const shortid = require("shortid");
var sizeOf = require("image-size");

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

    const fileName = shortid.generate();
    const imgBuffer = Buffer.from(base64, "base64");

    const request = {
        image: {
            content: imgBuffer,
        },
    };

    const [result] = await client.objectLocalization(request);

    console.log(result);

    fs.writeFileSync("./images/" + fileName + ".jpg", imgBuffer);

    const dimensions = sizeOf(imgBuffer);
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const context = canvas.getContext("2d");

    loadImage("./images/" + fileName + ".jpg").then((image) => {
        context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
        
        context.fillStyle = '#000'
        result.localizedObjectAnnotations.forEach((element) => {
            // çalışmıyo
            // çizim yapcaz kareleri çizcez normalizedVertices ile
        })

        const canvasBuffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./images/" + fileName + "_out.jpg", canvasBuffer);
    });
});

app.listen(3000);
