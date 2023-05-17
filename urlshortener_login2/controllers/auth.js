import express from "express";
import {register} from "./register.js";
import {login} from "./login.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;