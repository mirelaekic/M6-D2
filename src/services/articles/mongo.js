const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
//mongoose-paginate-v2

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
      type: Object,
      name:String,
      img:String,
    },
    author: {
        type: String,
        name:String,
        img:String,
      },
    cover: String,
    reviews: [{
      user: {
        type:String,
        required: true,
      },
      text: {
        type:String,
        required: true
      }
    }]
  },
  { timestamps: true }
)

newArticle.plugin(mongoosePaginate)

module.exports = mongoose.model("newArticle", newArticle)
