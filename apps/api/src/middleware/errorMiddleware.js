const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 400);
  const message = err.code === 'LIMIT_FILE_SIZE'
    ? 'File is too large. Maximum size is 5MB'
    : err.message || 'Something went wrong';

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
