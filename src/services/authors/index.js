  
const express = require("express")
const q2m = require("query-to-mongo")
const { authenticate, refreshToken } = require("../auth/tool")
const { authorize } = require("../auth/mdw")
const AuthorSchema = require("./authorSchema")

const authorsRouter = express.Router()

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find(req.query)
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:id",authorize, async (req, res, next) => {
  try {
    const id = req.params.id
    const author = await AuthorSchema.findById(id)
    if (author) {
      res.send(author)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading authors list a problem occurred!")
  }
})
authorsRouter.get("/me", authorize, async (req, res, next) => {
  try {
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorSchema(req.body)
    const { _id } = await newAuthor.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me",authorize, async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    updates.forEach(update => (req.user[update] = req.body[update]))
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/me", async (req, res, next) => {
  try {
    await req.author.deleteOne(res.send("Author deleted"))
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const author = await AuthorSchema.findByCredentials(email, password)
    const tokens = await authenticate(author)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})
authorsRouter.post("/logout", authorize, async (req, res, next) => {
  try {
    req.author.refreshTokens = req.author.refreshTokens.filter(
      t => t.token !== req.body.refreshToken
    )
    await req.author.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

authorsRouter.post("/logoutAll", authorize, async (req, res, next) => {
  try {
    req.author.refreshTokens = []
    await req.author.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

authorsRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken
  if (!oldRefreshToken) {
    const err = new Error("Refresh token missing")
    err.httpStatusCode = 400
    next(err)
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken)
      res.send(newTokens)
    } catch (error) {
      console.log(error)
      const err = new Error(error)
      err.httpStatusCode = 403
      next(err)
    }
  }
})

module.exports = authorsRouter