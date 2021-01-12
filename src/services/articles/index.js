/*
    MEDIUM PROJECT
    Your wonderful TAs have created a frontend clone of the famous Medium application. You can find it here --> https://github.com/ubeytdemirr/medium-template
    In every page's folder you should find some guidelines to properly use this frontend
    
    Your task is to build a proper backend being able to communicate with it. Backend needs to grant data persistance via MongoDB
    //BACKEND
    Your backend should have the following routes included:
    GET /articles => returns the list of articles
    GET /articles/:id => returns a single article
    POST /articles => create a new article
    PUT /articles/:id => edit the article with the given id
    DELETE /articles/:id => delete the article with the given id
    Article:
    
        {
            "_id": "string", // server generated
            "headLine": "string",
            "subHead": "string",
            "content": "string",
            "category": {
                "name": "string",
                "img": "string"
            },
            "author": {
                "name": "string",
                "img": "string"
            },
            "cover": "string",
            "createdAt": Date, // server generated
            "updatedAt": Date // server generated
        }
*/

const express = require("express");
const newArticle = require("./mongo");
const articleRouter = express.Router();
// GET ARTICLES
articleRouter.get("/", async (req, res, next) => {
  try {
    const articles = await newArticle.find();
    res.send(articles);
  } catch (error) {
    next(error);
  }
});
// GET ARTICLES BY ID
articleRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const articlesFound = await newArticle.findById(id);
    if (articlesFound) {
      res.send(articlesFound);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error, "unable to read articles!");
  }
});
//POST ARTICLE
articleRouter.post("/", async (req, res, next) => {
  try {
    const postArticle = new newArticle(req.body);
    const { _id } = await postArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});
//PUT ARTICLES/:id
articleRouter.put("/", async (req, res, next) => {
  try {
    const article = await newArticle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (article) {
        res.send(article)
    } else {
        const error = new Error(`Article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error);
  }
});
//DELETE ARTICLES/:id
articleRouter.delete("/:id", async (req, res, next) => {
    try {
      const article = await newArticle.findByIdAndDelete(req.params.id);
      if (article) {
        res.send("Deleted")
      } else {
        const error = new Error(`article with id ${req.params.id} not found`)
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  });

  module.exports = articleRouter;