const express = require('express');
const morgan = require('morgan');

const globalErrorHander = require('./controllers/errorController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/doctors', doctorRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);

app.use(globalErrorHander);

module.exports = app;
