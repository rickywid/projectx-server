"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var express_session_1 = __importDefault(require("express-session"));
var pg_1 = require("pg");
var pgSession = require('connect-pg-simple')(express_session_1.default);
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var github_auth_1 = __importDefault(require("./routes/auth/github/github-auth"));
var callback_1 = __importDefault(require("./routes/auth/github/callback"));
var login_1 = __importDefault(require("./routes/auth/login"));
var signup_1 = __importDefault(require("./routes/auth/signup"));
var user_1 = __importDefault(require("./routes/user"));
var app = express_1.default();
var port = 5000;
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_session_1.default({
    store: new pgSession({
        pool: new pg_1.Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOSTNAME,
            database: process.env.DB_NAME
        })
    }),
    secret: 'blkj4h3kj34hk34',
    cookie: { secure: false }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// auth routes
app.use('/api/auth/github', github_auth_1.default);
app.use('/api/auth/github/callback', callback_1.default);
app.use('/api/login/', login_1.default);
app.use('/api/signup/', signup_1.default);
app.use('/api/user/', user_1.default);
console.log(process.env.GITHUB_CLIENT_ID);
app.listen(process.env.PORT || 5000, function () { return console.log("Example app listening at http://localhost:" + port); });
