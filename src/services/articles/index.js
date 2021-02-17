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
const { mongoose } = require("mongoose");
const newReview = require("../reviews/newReview");
const newArticle = require("./mongo");
const articleRouter = express.Router();
const uniqid = require("uniqid");
const AuthorSchema = require("../authors/authorSchema")
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
    /*const article = {...req.body}
    article.author = req.author.name
    article.author = await AuthorSchema.find({email:article.author}, {_id:1})
    article.author = article.author[0]._id
    const newarticle = new newArticle(article)*/
    const postArticle = new newArticle(req.body);
    const { _id } = await postArticle.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});
//PUT ARTICLES/:id
articleRouter.put("/:id", async (req, res, next) => {
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
      res.send(article);
    } else {
      const error = new Error(`Article with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
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
      res.send("Deleted");
    } else {
      const error = new Error(`article with id ${req.params.id} not found`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});
//POST /articles/:id => adds a new review for the specified article

articleRouter.post("/:id", async (req, res, next) => {
  try {
    const review = new newReview(req.body )
    const insertReview = {...review, date: new Date()}
    const updated = await newArticle.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: insertReview,
        },
      },
      { runValidators: true, new: true}
    )
    res.status(201).send(updated)
  } catch (error) {
    next(error);
    console.log(error)
  }
});
// GET /articles/:id/reviews => returns all the reviews for the specified article
articleRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    let { reviews } = await newArticle.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    });
    res.send(reviews);
  } catch (error) {
    console.log(error);
    next(error, "unable to read reviews for this article!");
  }
});
//GET /articles/:id/reviews/:reviewId => returns a single review for the specified article
articleRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews } = await newArticle.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.id(req.params.reviewId) },
        },
      }
    );
    if (reviews && reviews.length > 0) {
      res.send(reviews[0]);
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// DELETE /articles/:id/reviews/:reviewId => delete the review belonging to the specified article
articleRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const modifiedReview = await newArticle.findByIdAndDelete(
      req.params.id,
      {
        $pull: {
          reviews: { _id: (req.params.reviewId) },
        },
      },
      {
        new: true,
      }
    )
    res.send(modifiedReview)
  } catch (error) {
    console.log(error)
    next(error)
  }
})
articleRouter.get("/:id/article/:authorId", async (req, res, next) => {
  try {
    const {article} = await newArticle.findOne(
      { _id: mongoose.Types.ObjectId(req.params.id) }, 
      {
        article: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.authorId) }, // returns just the element of the array that matches this _id condition
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
    res.send(article[0])
  } catch (error) {
    console.log(error)
    next("While reading authors list a problem occurred!")
  }
})

module.exports = articleRouter;
