const express = require("express");

const soulRouter = express.Router();
const {
  getSouls,
  getSoulsByDate,
  getSoulsBytown,
} = require("../controllers/souls");

soulRouter.get("/search", getSoulsBytown);
soulRouter.get("/", getSouls);
soulRouter.get("/:date", getSoulsByDate);

module.exports = soulRouter;
