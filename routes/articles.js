const express = require("express");
const Article = require("./../models/article.js");
const router = express.Router();

router.get("/new", function (req, res) {
  res.render("articles/newArticles.ejs", { article: new Article() });
});

router.get("/:slug", async function (req, res) {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) {
    res.redirect("/");
  }
  res.render("articles/show.ejs", { article: article });
});

router.get("/edit/:id", async function (req, res) {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit.ejs", { article: article });
});

router.post(
  "/",
  async function (req, res, next) {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async function (req, res, next) {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

function saveArticleAndRedirect(path) {
  return async function (req, res) {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect("/articles/" + article.slug);
    } catch (err) {
      res.render("articles/" + path, { article: article });
      console.log(err);
    }
  };
}

router.delete("/:id", async function (req, res) {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

module.exports = router;
