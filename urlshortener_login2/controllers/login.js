import jwt from "jsonwebtoken";
import db from "../db-config.js";
import bcrypt from "bcryptjs";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      status: "error",
      error: "Please enter your Email and Password",
    });
  else {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) throw err;
        if (
          !result.length ||
          !(await bcrypt.compare(password, result[0].hashedPassword))
        )
          return res.json({
            status: "error",
            error: "Incorrect Email or Password",
          });
        else {
          const token = jwt.sign(
            { id: result[0].id },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES,
            }
          );
          const cookieOptions = {
            expiresIn:
              new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          };
          res.cookie("userRegistered", token, cookieOptions);

          return res.json({
            status: "success",
            success: "User has been logged in!",
          });
        }
      }
    );
  }
};

export { login };
