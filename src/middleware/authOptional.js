const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    req.user = null;
    return next();
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}
  } catch (err) {
    req.user = null;
  }

  next();
};