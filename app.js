const express = require("express");
const app = express();
const cons = require("consolidate");
const swig = require("swig");
const bodyParser = require("body-parser");
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json({ limit: "40000MB" }));
app.engine("html", cons.swig);
app.set("view engine", "html");
app.set("views", __dirname + "/modules");
app.use(express.static(__dirname + "/public"));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 1000000
    })
);

app.use(session({
    name: "sessionCookieEvaluacion",
    secret: "qBne0kKyefUsJHcvjLV40b4fkJSE9zvp",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
}))

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(function (req, res, next) {
    if (req.session.user != null) {
        res.locals.user = req.session.user;
    }
    next();
});

app.use("/", require("./routes"));

const port = 5001
app.listen(port, error => {
    if (error) throw error;
    console.log("Server listen on port "+port);
})