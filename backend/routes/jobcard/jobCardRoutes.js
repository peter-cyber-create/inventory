const express = require("express");
const JobCardModel = require("../../models/jobcards/jobCardModel.js");
const JobCardSpare = require("../../models/jobCardSpare/JobCardSpare.js");
const VehicleModel = require("../../models/vehicles/vehicleModel.js");
const sequelize = require('../../config/db.js');
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
// import JobCard from "../../models/jobcards/jobCard.js";
// import Customer from "../../models/customers/customers.js";
// import Vehicle from "../../models/vehicles/vehicleModel.js";
// import JobCardSpare from "../../models/jobCardSpare/JobCardSpare.js";

const router = express.Router();

router.post("/", Auth, authorize('admin', 'garage'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const jobCard = await JobCardModel.create(
      req.body.data,

      { transaction }
    );

    const jocardSpare = await Promise.all(
      req.body.spare.map(async (row) => {
        if (process.env.NODE_ENV === 'development') {
            console.log("row", row);
        }
        return await JobCardSpare.create(
          {
            ...row,
            spareId: row.value,
            JobCardId: jobCard.id,
            partname: row.label,
            partno: row.partno,
            unitPrice: row.unitPrice,
            qtyUsed: row.qtyUsed,
          },
          { transaction }
        );
      })
    );
    await transaction.commit();
    res.status(201).json({
      status: "success",
      jobCard,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error,
    });
  }
});

router.get("/", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const job = await JobCardModel.findAll({
      include: [{ model: VehicleModel }],
    });

    res.status(200).json({
      status: "success",
      results: job,
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
    const job = await JobCardModel.findByPk(req.params.id, {
      include: [{ model: VehicleModel }],
    });

    if (!job) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      job,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Update JobCard
    const result = await JobCardModel.update(
      { ...req.body.data, updatedAt: sequelize.fn("NOW") },
      {
        where: {
          id: req.params.id,
        },
        transaction,
      }
    );

    // Check if the job card was found
    if (result[0] === 0) {
      await transaction.rollback();
      return res.status(404).json({
        status: "fail",
        message: "Job Card with that ID not found",
      });
    }

    await JobCardSpare.destroy(
      {
        where: { JobCardId: req.body.jobCardId },
        force: true,
      },
      { transaction }
    );

    // Create JobCardSpare entries
    await Promise.all(
      req.body.spare.map(async (row) => {
        await JobCardSpare.create(
          {
            ...row,
            spareId: row.value, // Valid UUID
            JobCardId: req.body.jobCardId,
          },
          { transaction }
        );
      })
    );

    await transaction.commit();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating Job Card:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
});

router.delete("/:id", Auth, authorize('admin'), async (req, res) => {
  const transaction = await sequelize.transaction();
  const { id } = req.params;
  try {
    await JobCardModel.destroy(
      {
        where: { id: id },
        force: true,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating Job Card:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
});

module.exports = router;
