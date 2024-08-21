const handleAsync = asyncFunction => async (req, res, next) => {
  try {
    await asyncFunction(req, res, next);
  } catch (error) {
    console.log(error);
    
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.error || error.message,
    });
  }
};

export default handleAsync;
