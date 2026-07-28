const express = require("express");
const searchController = require("../controllers/search.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Global search protected endpoint
router.get("/", authMiddleware.authenticate, searchController.searchGlobal);

module.exports = router;