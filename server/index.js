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

    // TODO: better random colors

    loadImage("./images/" + fileName + ".jpg").then((image) => {
        context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

        context.fillStyle = "#ff0000";
        context.font = "bold 16pt Arial";

        result.localizedObjectAnnotations.forEach((element, index) => {
            context.beginPath();

            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);

            context.fillStyle = "rgb(" + r + ", " + g + "," + b + ")";

            let vertices = element.boundingPoly.normalizedVertices;

            vertices = vertices.map((vertex) => ({
                x: vertex.x * dimensions.width,
                y: vertex.y * dimensions.height,
            }));

            for (let i = 0; i < vertices.length; i++) {
                const nextIndex = (i + 1) % vertices.length;

                context.moveTo(vertices[i].x, vertices[i].y);
                context.lineTo(vertices[nextIndex].x, vertices[nextIndex].y);
            }

            context.strokeStyle = "rgb(" + r + ", " + g + "," + b + ")";
            context.lineWidth = 3;
            context.stroke();

            context.fillText(element.name, vertices[0].x, vertices[0].y - 4);

            // çalışmıyo
            // çizim yapcaz kareleri çizcez normalizedVertices ile
        });

        const canvasBuffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./images/" + fileName + "_out.jpg", canvasBuffer);
        res.send(
            JSON.stringify({
                url: "/images/" + fileName + "_out.jpg",
            })
        );
    });
});

app.use("/images", express.static("images"));
app.listen(3000);
