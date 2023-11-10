const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const process = require('process');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

console.log({env: process.env.NODE_ENV});

if (process.env.NODE_ENV) {
    dotenv.config({
        path: `${__dirname}/.env.${process.env.NODE_ENV}`
    });
} else {
    dotenv.config();
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Origin ,Authorization, Content-Type, X-Csrf-Token, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    }
    else {
        return next();
    }
});

const Routes = require('./app/routes/routes');
Routes.APP.Attendance.includeRoutes(app); 

const port = process.env.PORT || 3000;
if (process.env.RUN_MODULE != "MAIN") {
    app.listen(port, () => {
        console.log(`attendance server listening at http://localhost:${port}`);
    });
}

module.exports = { app };
