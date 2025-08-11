const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { doCheckin } = require("../controllers/checkin.controller");

router.post("/", protect, authorizeRoles("organizer", "admin"), doCheckin);

module.exports = router;
