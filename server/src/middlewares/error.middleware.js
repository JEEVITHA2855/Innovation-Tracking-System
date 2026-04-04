const errorHandler = (err, req, res, next) => {
  const isPrismaInitError =
    err?.name === 'PrismaClientInitializationError' ||
    /Can't reach database server/i.test(err?.message || '');

  const status = isPrismaInitError ? 503 : (err.status || 500);
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isPrismaInitError
    ? 'Database is unavailable. Please try again shortly.'
    : (err.message || 'Internal server error');

  res.status(status).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
