import express from "express";
import Audit from "../../models/Logs/auditModel.js";
import Asset from "../../models/assets/assetsModel.js";
import Disposal from "../../models/assets/DisposalModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const disposal = await Disposal.create(req.body);

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
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const disposal = await Disposal.findAll({ limit, offset: skip });

    res.status(200).json({
      status: "success",
      results: disposal.length,
      disposal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const result = await Disposal.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Disposal with that ID not found",
      });
    }

    const disposal = await Disposal.findByPk(req.params.id);

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
router.patch("/:id", async (req, res) => {
  try {
    const result = await Disposal.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Disposal with that ID not found",
      });
    }

    const disposal = await Disposal.findByPk(req.params.id);

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
router.get("/:id", async (req, res) => {
  const {id }=req.params
  try {
    const disposal = await Disposal.findOne({
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

router.get("/asset/:id", async (req, res) => {
  try {
    const disposal = await Disposal.findAll({
      where: {
        assetId: req.params.id,
      },
    });

    if (!disposal || disposal.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Disposal with that assetId not found",
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

router.delete("/:id", async (req, res) => {
  try {
    const result = await Disposal.destroy({
      where: { id: req.params.id },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Disposal with that ID not found",
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

export default router;
