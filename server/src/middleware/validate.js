export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });
  if (!result.success) {
    const errors = result.error.flatten();
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.fieldErrors,
    });
  }
  if (result.data.body) req.body = result.data.body;
  if (result.data.query) req.query = result.data.query;
  if (result.data.params) req.params = result.data.params;
  next();
};
