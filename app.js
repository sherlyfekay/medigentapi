const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const agentRoutes = require('./api/routes/agents');
const roleRoutes = require('./api/routes/roles');
const patientRoutes = require('./api/routes/patients');
const addressRoutes = require('./api/routes/addresses');
const offerRoutes = require('./api/routes/offers');
const orderRoutes = require('./api/routes/orders');
const historyRoutes = require('./api/routes/histories');
const shiftRoutes = require('./api/routes/shifts');
const ooRoutes = require('./api/routes/ordersoffers');
const articleRoutes = require('./api/routes/articles');

// mongoose.connect("mongodb://admin:" + process.env.MONGO_ATLAS_PW + 
//     "@medigent-shard-00-00-jfxgi.mongodb.net:27017,medigent-shard-00-01-jfxgi.mongodb.net:27017,medigent-shard-00-02-jfxgi.mongodb.net:27017/test?ssl=true&replicaSet=medigent-shard-0&authSource=admin"
// );
//mongoose.Promise = global.Promise;

//dari luar pakai jagopesan.com // dari dalam pakai localhost
mongoose.connect("mongodb://sherly:sherlycantiksekail@localhost:64526/medigent");

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/users', userRoutes);
app.use('/agents', agentRoutes);
app.use('/roles', roleRoutes);
app.use('/patients', patientRoutes);
app.use('/addresses', addressRoutes);
app.use('/offers', offerRoutes);
app.use('/orders', orderRoutes);
app.use('/histories', historyRoutes);
app.use('/shifts', shiftRoutes);
app.use('/ordersoffers', ooRoutes);
app.use('/articles', articleRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json ({
        error: {
            message: error.message
        }
    });
});

module.exports = app;