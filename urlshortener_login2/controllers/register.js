import db from "../db-config.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { email, password: Npassword } = req.body;
  if (!email || !Npassword)
    return res.json({ status: "error", error: "Please enter your Email and Password" });
  else {
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) throw err;
      if (result[0]) return res.json({ status: "error", error: "This Email has already been registered" });
      else {
        const password = await bcrypt.hash(Npassword, 8);
        db.query('INSERT INTO users SET ?', { email: email, hashedPassword: password, type: "free" }, (error, results) => {
          if (error) throw error;
          return res.json({ status: "success", success: "User has been Registered!" });
        });
      }
    });
  }
};

export {register};