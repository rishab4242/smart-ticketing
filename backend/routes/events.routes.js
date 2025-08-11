const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const {
  createEvent,
  getEvent,
  editEvent,
  exportCSV,
} = require("../controllers/event.controller");

router.post("/", protect, authorizeRoles("organizer"), createEvent);
router.get("/:id", protect, getEvent);
router.patch("/:id", protect, authorizeRoles("organizer", "admin"), editEvent);
router.get(
  "/:id/export",
  protect,
  authorizeRoles("organizer", "admin"),
  exportCSV
);

module.exports = router;
