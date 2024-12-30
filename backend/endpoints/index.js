const express = require("express");
const router = express.Router();
const porRoutes = require("./por");
const uploadRoutes = require("./upload");

// Agregar las rutas de cada módulo
router.use("/por", porRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;
