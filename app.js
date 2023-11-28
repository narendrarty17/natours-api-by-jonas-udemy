const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

console.log('inside app.js');
// Global Middlewares
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security http headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit requests from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP! please try again in an hour'
});
app.use('/api', limiter);

// body parser, reading data from the body into req.body
app.use(express.json({
    limit: '10kb'
}));

// Data sanitization against no sql query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
console.log('before app.use of bookingRouter');
app.use('/api/v1/bookings', bookingRouter);
console.log('after app.use of bookingRotuer');

app.all('*', (req, res, next) => {
    next(new AppError(
        `Can't find ${req.originalUrl} on this server!`, 404
    ));
});
app.use(globalErrorHandler);

module.exports = app;
