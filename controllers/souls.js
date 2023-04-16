const Souls = require("../model.js");
const ApiError = require("../errors/ApiError.js");


function updateCount(countDict, gender){
  if (gender == "Male"){
    countDict.male += 1;
  }
  else if (gender == "Female"){
    countDict.female += 1;
  } 
  return countDict;
}

function getSummary(souls){
  var summary = {
    adult: {male: 0, female: 0},
    youth: {male: 0, female: 0},
    children: {male: 0, female: 0}
  }

  for (const soul of souls) {
    if (soul.ageGroup == "Adult"){
      summary.adult = updateCount(summary.adult, soul.gender);
    }
    else if (soul.ageGroup == "Youth"){
      summary.youth = updateCount(summary.youth, soul.gender);
    }
    else if (soul.ageGroup == "Child"){
      summary.children = updateCount(summary.children, soul.gender);
    }
  }

  return summary;
}

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
    const summary = getSummary(souls);

    const metadata = {
      result_set: {
        count: souls.length,
        total: souls.length,
      },
    };
    res.status(200).json({ 
      status: "successs",
      data: souls, 
      summary: summary,
      metadata });
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
    const summary = getSummary(souls);

    res.status(202).json({
      status: "successs",
      data: souls,
      summary: summary,
      metadata });
  } catch (error) {
    return next(ApiError.BadRequest(error));
  }
};

const getDailySummary = async (req, res) => {
  try {
    const date = req.params.date;

    const souls = await Souls.find({ date: date });
    const summary = getSummary(souls);

    const metadata = {
      result_set: {
        count: souls.length,
        total: souls.length,
      },
    };
    res.status(200).json({ status: "successs", summary: summary, metadata });
  } catch (error) {
    return next(ApiError.BadRequest(error));
  }
}

module.exports = {
  getSouls,
  getSoulsByDate,
  getSoulsBytown,
  getDailySummary,
};
