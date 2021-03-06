const express = require("express");
const router = express.Router();

router.use("/users", require("../lib/users/routes"));
router.use("/admin", require("../lib/admin/routes"));
router.use("/geofences", require("../lib/geofences/routes"));
router.use("/points", require("../lib/points/routes"));
router.use("/request", require("../lib/request/routes"));

module.exports = router;
