const { Schema, model } = require("mongoose")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AuthorSchema = new Schema({
  name: String,
  surname: String,
  authorId: String,
  password: {
    type:String,
    required:true,
  },
  email: {
    type:String,
    unique:true,
    required:true
  },
  refreshTokens: [{ token: { type: String } }],
  googleId: String,
 },
 {timestamps:true} 
 )

 AuthorSchema.methods.tojSON = function (){
   const author = this
   const authorToObject = author.toObject()
   delete authorToObject.password
   return authorToObject
 }

 AuthorSchema.statics.findByCredentials = async function (email,password) {
   const author = await this.findOne({email})
   if(author) {
     const matches = await bcrypt.compare(password, author.password)
     if(matches)
     return author 
     else return null
   } else {
     return null
   }
 }

 AuthorSchema.pre("save", async function (next) {
   const author = this 
   const pass = author.password
   if(author.isModified("password")){
     author.password = await bcrypt.hash(pass,10)
   }
   next()
 })
 const author = mongoose.models["Author"] || mongoose.model("Author", AuthorSchema)
module.exports = author