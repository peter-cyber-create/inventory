const express = require("express");
const Op = require('sequelize');
const Vehicle = require("../../models/vehicles/vehicleModel.js");
const Audit = require("../../models/Logs/auditModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

router.post("/", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    const audit = await Audit.create({
      action: "New Vehicle Creation",
      actionedBy: req.body.requestedBy,
      description: "A New Vehicle Has Created In the Vehicle Asset Register",
      assetId: vehicle.id,
    });

    res.status(201).json({
      status: "success",
      vehicle,
      audit,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Error====>", error);
    }
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search ? req.query.search.trim() : "";
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { old_number_plate: { [Op.iLike]: `%${search}%` } },
            { new_number_plate: { [Op.iLike]: `%${search}%` } },
            { make: { [Op.iLike]: `%${search}%` } },
            { driver: { [Op.iLike]: `%${search}%` } },
            { officer: { [Op.iLike]: `%${search}%` } },
            { type: { [Op.iLike]: `%${search}%` } },
            { chassis_no: { [Op.iLike]: `%${search}%` } },
            { user_department: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const totalRecords = await Vehicle.count({ where: whereClause });
    const totalPages = Math.ceil(totalRecords / limit);

    const vehicles = await Vehicle.findAll({
      where: whereClause,
      limit,
      offset: skip,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      results: vehicles.length,
      totalRecords,
      totalPages,
      currentPage: page,
      vehicle: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
router.get("/all", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();

    res.status(200).json({
      status: "success",
      results: vehicles.length,

      vehicle: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


router.put("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const result = await Vehicle.update(
            { ...req.body },
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

    const vehicle = await Vehicle.findByPk(req.params.id);

    res.status(200).json({
      status: "success",
      vehicle,
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
    const vehicle = await Vehicle.findByPk(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      vehicle,
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
    const result = await Vehicle.destroy({
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
