const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const newArticle = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      name:String,
      img:String,
    },
    author: {
        type: String,
        name:String,
        img:String,
      },
    cover: String,
  },
  { timestamps: true }
)

newArticle.plugin(mongoosePaginate)

module.exports = mongoose.model("newArticle", newArticle)
