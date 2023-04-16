const express = require("express");

const soulRouter = express.Router();
const {
  getSouls,
  getSoulsByDate,
  getSoulsByDateRange,
  getSoulsBytown,
  getDailySummary,
} = require("../controllers/souls");

soulRouter.get("/search", getSoulsBytown);
soulRouter.get("/", getSouls);
soulRouter.get("/:date", getSoulsByDate);
soulRouter.get("/:dateBegin/:dateEnd", getSoulsByDateRange);
soulRouter.get("/dailysummary/:date", getDailySummary);

module.exports = soulRouter;
