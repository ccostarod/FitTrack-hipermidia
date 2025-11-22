const express = require("express");
const alunoController = require("../controllers/alunoController");

const router = express.Router();

router.get("/", (req, res) => alunoController.getAll(req, res));

router.get("/:id", (req, res) => alunoController.getById(req, res));

router.post("/", (req, res) => alunoController.create(req, res));

router.put("/:id", (req, res) => alunoController.update(req, res));

router.delete("/:id", (req, res) => alunoController.delete(req, res));

module.exports = router;
