const catchAsync = require('../utils/catchAsync');

exports.bookAppo = catchAsync(async (req, res, next) => {
   console.log('Book Appointment');
});
exports.deleteAppo = catchAsync(async (req, res, next) => {
   res.status(200).json({
      status: success,
      message: 'Deleted successfully',
   });
});
