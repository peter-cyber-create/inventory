const express = require("express");
const SparePart = require("../../models/vehicles/vSpareParts.js");
const VSpareCategory = require("../../models/vehicles/vSpareCategory.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
const xss = require('xss');

const router = express.Router();

router.post("/", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const sanitizedBody = {};
    for (const key in req.body) {
      sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
    }
    const sparepart = await SparePart.create(sanitizedBody);

    res.status(201).json({
      status: "success",
      sparepart,
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
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const skip = (page - 1) * limit;

    const sparepart = await SparePart.findAll({
      limit,
      offset: skip,
      include: [{ model: VSpareCategory }],
    });

    res.status(200).json({
      status: "success",
      results: sparepart.length,
      sparepart,
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
    const result = await SparePart.update(
      { ...sanitizedBody },
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

    const sparepart = await SparePart.findByPk(req.params.id);

    res.status(200).json({
      status: "success",
      sparepart,
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
    const sparepart = await SparePart.findByPk(req.params.id);

    if (!sparepart) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      sparepart,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/qty/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const sparepart = await SparePart.findByPk(req.params.id);

    if (!sparepart) {
      return res.status(404).json({
        status: "fail",
        message: "Server with that ID not found",
      });
    }
    const { qty } = sparepart;
    res.status(200).json({
      status: "success",
      qty,
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
    const result = await SparePart.destroy({
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

router.patch("/update/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
  try {
    const sanitizedBody = {};
    for (const key in req.body) {
      sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
    }
    const sparepart = await SparePart.findByPk(req.params.id);

    if (!sparepart) {
      return res.status(404).json({
        status: "fail",
        message: "Spare part with that ID not found",
      });
    }

    const { qty } = sparepart;

    // Convert to numbers using parseFloat and validate
    const currentQuantity = parseFloat(qty);
    const requestedQuantity = parseFloat(sanitizedBody.qty);

    if (isNaN(currentQuantity) || isNaN(requestedQuantity)) {
      return res.status(400).json({
        status: "fail",
        message: "Quantity values must be valid numbers",
      });
    }

    // Ensure the requested quantity does not exceed the current quantity
    if (requestedQuantity > currentQuantity) {
      return res.status(400).json({
        status: "fail",
        message: "Requested quantity exceeds available stock",
      });
    }

    // Perform arithmetic
    const resultQuantity = currentQuantity - requestedQuantity;

    // Convert result back to string before saving
    const result = await SparePart.update(
      { ...sanitizedBody, qty: resultQuantity.toString() },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.status(200).json({
      status: "success",
      message: "Spare part updated successfully",
      updatedFields: {
        qty: resultQuantity.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
