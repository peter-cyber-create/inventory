const express = require("express");
const VDisposalModel = require("../../models/vehicles/vDisposalModel.js");
const VehicleModel = require("../../models/vehicles/vehicleModel.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const disposal = await VDisposalModel.create(req.body);

    res.status(201).json({
      status: "success",
      disposal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const disposals = await VDisposalModel.findAll({
      include: [{ model: VehicleModel }],
    });

    res.status(200).json({
      status: "success",
      results: disposals,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const disposals = await VDisposalModel.findAll({
      include: [{ model: VehicleModel }],
    });

    res.status(200).json({
      status: "success",
      results: disposals,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
router.get("/:id", async (req, res) => {
  const {id }=req.params
  try {
    const disposal = await VDisposalModel.findOne({
      where: { vehicleId: id },
    });

    if (!disposal) {
      return res.status(404).json({
        status: "fail",
        message: "Disposal with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      disposal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
module.exports = router;
