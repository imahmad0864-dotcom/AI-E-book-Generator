const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { generateOutline, generateChapters } = require("../controllers/newController");

router.post('/create', verifyToken, generateOutline);
router.post('/chapters', verifyToken, generateChapters);

module.exports = router;