import express, { Express, Response, Request } from "express";
const cors = require("cors");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const app: Express = express();
const PORT = 4321;

app.use(cors());

app.get("/", (req, res: Response) => {
  res.send("Typescript + node works");
});

app.post("/uploadFile", (req: Request, res: Response) => {
  const file = req.body;
  console.log(file);
  if (file == undefined) {
    res.send("failed");
    return;
  }
  console.log("WTF");
  res.send("Gotcha");
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});
