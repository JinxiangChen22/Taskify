const { urlencoded } = require("express");
const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();
require("../src/db/conn");
const requireAuth = require("./middleware/requireAuth");
const views_path = path.join(__dirname, "../views");
const static_path = path.join(__dirname, "../static");
const app = express();
app.set("etag", false);
const port = process.env.PORT || 80;

const sessionSecret =
    process.env.SESSION_SECRET || "dev-only-session-secret-not-for-production";

app.use("/static", express.static(static_path));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60,
        },
    })
);


app.set("view engine", "ejs");
app.set("views", views_path);

app.get("/", (req, res) => {
    res.status(200).render("index.ejs");
});

app.get("/signup", (req, res) => {
    res.status(200).render("signup.ejs");
});

app.post("/login", (req, res) => {
    const email = (req.body.LoginEmail || "").trim();
    const password = (req.body.LoginPassword || "").trim();
    if (!email || !password) {
        return res.status(400).render("signup.ejs", {
            loginError: "Email and password are required.",
        });
    }
    req.session.user = { username: email };
    return res.redirect(302, "/dashboard");
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Could not log out.");
        }
        return res.redirect(302, "/");
    });
});

app.get("/dashboard", requireAuth, (req, res) => {
    res.status(200).render("dashboard/dashboard.ejs");
});




//* listen
if (require.main === module) {
    app.listen(port, () => {
        console.log(`The application started successfully on port ${port}`);
    });
}

module.exports = app;