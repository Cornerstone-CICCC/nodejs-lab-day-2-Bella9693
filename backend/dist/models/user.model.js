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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    // For tests: create a sample user
    constructor() {
        this.users = [];
        // hashed password for 'password123'
        // but we won't auto-add unless you want. can add sample user if needed.
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users.find((u) => u.username === username);
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            const hashed = user.password;
            const newUser = Object.assign(Object.assign({ id }, user), { password: hashed });
            this.users.push(newUser);
            return newUser;
        });
    }
    login(username, plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUsername(username);
            if (!user)
                return null;
            const match = yield bcrypt_1.default.compare(plainPassword, user.password);
            return match ? user : null;
        });
    }
    // helper to seed a hashed user (optional)
    seedUser(username_1, plainPassword_1) {
        return __awaiter(this, arguments, void 0, function* (username, plainPassword, firstname = "Test", lastname = "User") {
            const hashed = yield bcrypt_1.default.hash(plainPassword, 10);
            return this.create({ username, password: hashed, firstname, lastname });
        });
    }
    // expose array for debug
    getAll() {
        return this.users;
    }
}
exports.default = new UserModel();
