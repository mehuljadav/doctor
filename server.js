const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

process.on('uncaughtException', (err) => {
   console.log('UNCAUGHT EXCEPTION! Shutting down...');
   console.log(err.name, err.message);
   process.exit(1);
});

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
mongoose
   .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('Database Connected!');
   })
   .catch((error) => {
      console.log('Database connection failed!');
      console.log(error);
   });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log('Server:', PORT);
});

process.on('unhandledRejection', (err) => {
   console.log('UNCAUGHT EXCEPTION! Shutting down...');
   console.log(err.name, err.message);
   process.exit(1);
});
