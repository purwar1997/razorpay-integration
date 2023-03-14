const asyncHandler = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message || err.error.description,
    });
  }
};

module.exports = asyncHandler;
