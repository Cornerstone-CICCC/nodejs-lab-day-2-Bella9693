"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Create your server
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:4321",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// session setup (in-memory, for learning purposes)
app.use((0, express_session_1.default)({
    secret: "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // 개발에서는 false. 실제 배포시 HTTPS면 true.
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));
// Routes
app.use("/users", user_routes_1.default);
app.use((req, res, next) => {
    res.status(404).json({
        message: "Invalid route!",
    });
});
// Start server
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Missing port!");
}
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
