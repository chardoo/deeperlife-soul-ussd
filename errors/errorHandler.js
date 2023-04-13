const ApiError = require("./ApiError");

function apiErrorHander(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }

  res.status(500).json("something went wrong");
}

module.exports = apiErrorHander;
