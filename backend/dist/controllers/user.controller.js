"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = exports.logout = exports.loginUser = exports.addUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = req.body;
        if (!username || !password || !firstname || !lastname) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const exists = yield user_model_1.default.findByUsername(username);
        if (exists) {
            res.status(409).json({ message: "Username taken" });
            return;
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const user = yield user_model_1.default.create({
            username,
            password: hashed,
            firstname,
            lastname,
        });
        const { password: _p } = user, publicUser = __rest(user, ["password"]);
        res.status(201).json(publicUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addUser = addUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Missing fields" });
            return;
        }
        const user = yield user_model_1.default.findByUsername(username);
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        req.session.username = user.username;
        res.json({ message: "Logged in", username: user.username });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
const logout = (req, res) => {
    var _a, _b;
    (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out" });
    });
};
exports.logout = logout;
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionUsername = (_a = req.session) === null || _a === void 0 ? void 0 : _a.username;
        if (!sessionUsername) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const user = yield user_model_1.default.findByUsername(sessionUsername);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { password: _p } = user, publicUser = __rest(user, ["password"]);
        res.json(publicUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserByUsername = getUserByUsername;
