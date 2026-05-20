export const success = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

export const paginated = (res, data, pagination, message = 'Success') => {
  res.status(200).json({ success: true, message, data, pagination });
};

export const error = (res, message = 'Error', statusCode = 500, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
