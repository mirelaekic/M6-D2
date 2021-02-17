const jwt = require("jsonwebtoken");
const Author = require("../authors/AuthorSchema");

const authenticate = async (author) => {
  try {
    const newToken = await generateJWT({ _id: author._id });
    const newRefreshToken = await generateRefreshJWT({ _id: author._id });

    author.refreshTokens = author.refreshTokens.concat({
      token: newRefreshToken,
    });
    await author.save();
    return { token: newToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};

const generateJWT = (playload) =>
  new Promise((res, rej) =>
    jwt.sign(
      playload,
      process.env.JWT_SECRET,
      { expiresIn: 5 },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );
const refreshToken = async (oldRefreshToken) => {
  const decoded = await verifyRefreshToken(oldRefreshToken);

  const author = await Author.findOne({ _id: decoded._id });

  if (!author) {
    throw new Error(`Access is forbidden`);
  }
  const currentRefreshToken = author.refreshTokens.find(
    (t) => t.token === oldRefreshToken
  );

  if (!currentRefreshToken) {
    throw new Error(`Refresh token is wrong`);
  }

  const newAccessToken = await generateJWT({ _id: author._id });
  const newRefreshToken = await generateRefreshJWT({ _id: author._id });

  const newRefreshTokens = author.refreshTokens
    .filter((t) => t.token !== oldRefreshToken)
    .concat({ token: newRefreshToken });

  author.refreshTokens = [...newRefreshTokens];

  await author.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};
module.exports = { authenticate, verifyJWT, refreshToken };
