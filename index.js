import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootsratp from "./src/index.router.js";
const app = express();
const port = process.env.PORT;

bootsratp(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
