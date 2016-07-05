'use strict';

// ============================================================
// === Imports ================================================
// ============================================================

// globals

const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const compression = require('compression');

// routes

const index = require('./routes/index');

// ============================================================
// === Setup ==================================================
// ============================================================

// setup

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname,'public')));

app.use(compression());

// route handling

app.use('*',[index]);

// error handling

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    var response = {
        error: {
            status: err.status || 500,
            detail: err.message
        }
    };
    res.status(err.status || 500).json(response);
});

// ============================================================
// === Startup ================================================
// ============================================================

module.exports = app;