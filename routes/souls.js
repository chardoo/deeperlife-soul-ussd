const express = require("express");

const soulRouter = express.Router();
const {
  getSouls,
  getSoulsByDate,
  getSoulsBytown,
  getDailySummary,
} = require("../controllers/souls");

soulRouter.get("/search", getSoulsBytown);
soulRouter.get("/", getSouls);
soulRouter.get("/:date", getSoulsByDate);
soulRouter.get("/dailysummary/:date", getDailySummary);

module.exports = soulRouter;
