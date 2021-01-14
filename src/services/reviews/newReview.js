const { Schema, model } = require("mongoose");

const newReview = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

module.exports = model("newreviews", newReview);
