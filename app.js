const express = require('express');
const app = express();
const ExpressErrors = require('./expressErrors');
const listRoutes = require('./routes/routes');

app.use(express.json());

app.use('/items', listRoutes);


app.use((err, req, res, next) => {
    throw new ExpressErrors('Page not found', 404);
});

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: {
            message: message,
            status: status
        }
    });
});

module.exports = app;