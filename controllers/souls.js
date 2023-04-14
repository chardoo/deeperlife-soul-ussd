const Souls = require("../model.js");
const ApiError = require("../errors/ApiError.js");

const getSouls = async (_req, res, next) => {
  try {
    const souls = await Souls.find();
    const metadata = {
      result_set: {
        count: souls.length,
        total: souls.length,
      },
    };

    res
      .status(200)
      .json({ status: "successs", data: souls, totalSouls: metadata });
  } catch (error) {
    return next(ApiError.BadRequest(error));
  }
};

const getSoulsByDate = async (req, res) => {
  try {
    const date = req.params.date;

    const souls = await Souls.find({ date: date }).sort({ date: 1 });
    const metadata = {
      result_set: {
        count: souls.length,
        total: souls.length,
      },
    };
    res.status(200).json({ status: "successs", data: souls, metadata });
  } catch (error) {
    return next(ApiError.BadRequest(error));
  }
};

const getSoulsBytown = async (req, res) => {
  try {
    let query = {};
    const queryObj = req.query;
    if (queryObj.town) {
      let search = queryObj.town;
      let town = { $regex: search, $options: "i" };
      query = { ...query, town: town };
    }

    const souls = await Souls.find(query).sort({ date: 1 });
    const metadata = {
      result_set: {
        count: souls.length,
        total: souls.length,
      },
    };
    if (souls.length < 1) {
      return res.status(404).json({
        status: "success",
        message: `Soul with the town ${queryObj.town} does not exist`,
        data: souls,
        metadata,
      });
    }

    res.status(202).json({ status: "successs", data: souls, metadata });
  } catch (error) {
    return next(ApiError.BadRequest(error));
  }
};
module.exports = {
  getSouls,
  getSoulsByDate,
  getSoulsBytown,
};
