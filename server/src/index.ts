import express, { Express, Response, Request } from "express";
const multer = require("multer");
const cors = require("cors");
const app: Express = express();
const PORT = 4321;

app.use(cors());

app.get("/", (req, res: Response) => {
  res.send("Typescript + node works");
});

app.post("/uploadFile", (req: Request, res: Response) => {
  try {
    const file = req.body;
    console.log(file);
    res.status(200).send({ reply: "Received file" });
  } catch (err) {
    console.log(`error: ${err}`);
    res.status(500).send({ err });
  }
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
