const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling uncaught exceptions
process.on('uncaughtException', err => {
    console.log('UNHANDLED EXCEPTION! * Shutting down...');
    console.log('Error Name: ', err.name);
    console.log('Error message:', err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(con => console.log('DB connection successful'));



const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! * Shutting down...');
    console.log('Error name: ', err.name)
    console.log('Error message: ', err.message);
    server.close(() => {
        process.exit(1);
    });
});
