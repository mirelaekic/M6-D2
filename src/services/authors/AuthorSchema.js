const { Schema, model } = require("mongoose")

const AuthorSchema = new Schema({
  name: String,
  surname: String,
  authorId: String,
})

module.exports = model("Author", AuthorSchema)