"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// POST /api/users/signup
router.post("/signup", user_controller_1.addUser);
// POST /api/users/login
router.post("/login", user_controller_1.loginUser);
// GET /api/users/logout
router.get("/logout", user_controller_1.logout);
// GET /api/users/check-auth
router.get("/check-auth", user_controller_1.getUserByUsername);
exports.default = router;
