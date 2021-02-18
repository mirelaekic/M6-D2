const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const author = require("../authors/AuthorSchema")
const { authenticate } = require("./")

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3008/authors/googleRedirect",
    },
    async (request, accessToken, refreshToken, profile, next) => {
      const newAuthor = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        refreshTokens: [],
      }

      try {
        const user = await author.findOne({ googleId: profile.id })

        if (user) {
          const tokens = await authenticate(user)
          next(null, { user, tokens })
        } else {
          const createdAuthor = new author(newAuthor)
          await createdAuthor.save()
          const tokens = await authenticate(createdAuthor)
          next(null, { user: createdAuthor, tokens })
        }
      } catch (error) {
        next(error)
      }
    }
  )
)

passport.serializeUser(function (user, next) {
  next(null, user)
})