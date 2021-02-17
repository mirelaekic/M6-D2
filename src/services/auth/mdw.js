const author = require("../authors/AuthorSchema")
const {verifyJWT} = require("./tool")

const authorize = async (req,res,next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = await verifyJWT(token)
        const AuthAuthor = await author.findOne({_id:decoded._id})
        if(!AuthAuthor){
            throw new Error()
        }
        req.token = token
        req.author = AuthAuthor
        next()
    } catch (error) {
        const err = new Error("You have to authenticate!")
        err.httpStatusCode = 401
        next(err)
    }
}

module.exports = {authorize}