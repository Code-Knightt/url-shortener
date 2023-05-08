import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Shortener from "./schema.js";
import Counter from "./counterSchema.js";
import encode_url from "./shorten.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/url_shortener")
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => console.error(err));

app.get("/", async (req, res) => {
  const table = await Shortener.find({});
  res.render("index", { table: table });
});

app.post("/edit", async (req, res) => {
  const url = req.body.url;
  const short_url = req.body.shortUrl;
  let link = await Shortener.findOne({ shortUrl: short_url });

  link.url = url;
  await link.save();
  res.redirect("/");
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  let link = await Shortener.findOne({ shortUrl: id });
  if (!link) {
    res.redirect("/");
  }

  res.render("edit", { url: link.url, shortUrl: link.shortUrl });
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  let link = await Shortener.deleteOne({ shortUrl: id });
  res.redirect("/");
});

app.post("/shorten", async (req, res) => {
  let count = await Counter.findOne({});

  if (!count) {
    count = new Counter({
      count: Number(process.env.InitialCount),
    });
  }

  let long_url = req.body.url;
  const short_url = encode_url(count.count);

  const web_regex = new RegExp("http", "i");
  const verify = String(long_url).match(web_regex);

  if (!verify) {
    long_url = "https://" + long_url;
  }

  const dbObject = new Shortener({
    url: long_url,
    shortUrl: short_url,
    counterValue: count.count,
  });

  count.count++;
  await count.save();
  await dbObject.save();

  res.redirect("/");
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  Shortener.find({ shortUrl: id }, (err, result) => {
    if (err) {
      res.send("Error");
    } else {
      res.redirect(result[0]?.url);
    }
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
