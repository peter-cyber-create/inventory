const express = require("express");
const Driver = require("../../models/vehicles/vDrivers.js");
const Vehicle = require("../../models/vehicles/vehicleModel.js");
const Audit = require("../../models/Logs/auditModel.js");
const Service = require("../../models/vehicles/vServiceRequest.js");
const Department = require("../../models/categories/departmentModel.js");
const VehicleModel = require("../../models/vehicles/vehicleModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

router.post("/request", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const service = await Service.create(req.body);


    res.status(201).json({
      status: "success",
      service,
      audit,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
});

router.get("/request", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    // const page = req.query.page || 1;
    // const limit = req.query.limit || 50;
    // const skip = (page - 1) * limit;

    const service = await Service.findAll({
      include: [{ model: VehicleModel}],
    });

    res.status(200).json({
      status: "success",
      results: service.length,
      service,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/recieved", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const garage = await Service.findAll({
      include: { model: Vehicle },
      where: { isRequest: true },
    });

    res.status(200).json({
      status: "success",
      garage,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const sanitizedBody = {};
    for (const key in req.body) {
      sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
    }
    const result = await Service.update(
      { ...sanitizedBody, updatedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    const service = await Service.findByPk(req.params.id);

    res.status(200).json({
      status: "success",
      service,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      service,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:id", Auth, authorize('admin'), async (req, res) => {
  try {
    const result = await Service.destroy({
      where: { id: req.params.id },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
