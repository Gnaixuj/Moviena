const express = require("express");
const router = express.Router();

const peopleController = require("../controllers/peopleController");

router.get("/:id", peopleController.getPeopleDetails);

module.exports = router;

