import db from "../db-config.js";
import jwt from "jsonwebtoken";

const loggedIn = (req, res, next) => {
  if (!req.cookies.userRegistered) return next(); // Checks whether the cookie exists or not
  try {
    const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
    db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, result) => {
      if (err) return next();
      req.user = result[0];
      return next();
    });
  } catch (err) {
    if (err) return next();
  }
};

export default loggedIn;
