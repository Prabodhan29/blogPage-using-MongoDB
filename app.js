
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Article = require("./models/article.js");
const articleRouter = require("./routes/articles.js");

mongoose.connect("mongodb://localhost/blogPost", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use("/articles", articleRouter);

app.get("/", async function(req, res) {
    const articles = await Article.find().sort({date: "desc"});
    res.render("index.ejs", {text: articles});
});

app.all("*", function(req, res) {
    res.status(404).send("<h1> Page not found </h1>");
});

app.listen(5000, function() {
    console.log("This server is running on port 5000");
});