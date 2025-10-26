const express = require("express");
const JobCardSpare = require("../../models/jobCardSpare/JobCardSpare.js");


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const sparepart = await JobCardSpare.create(req.body);

    res.status(201).json({
      status: "success",
      sparepart,
    });
  } catch (error) {
    console.log("Error====>", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;

    const sparepart = await JobCardSpare.findAll({
      limit,
      offset: skip,
    });

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

router.patch("/:id", async (req, res) => {
  try {
    const result = await JobCardSpare.update(
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

    const sparepart = await JobCardSpare.findByPk(req.params.id);

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

router.get("/:id", async (req, res) => {
  try {
    // const sparepart = await JobCardSpare.findByPk(req.params.id);

    const spareparts = await JobCardSpare.findAll({
      where: {
        JobCardId: req.params.id, // Correct condition format
      },
    });
    

    // if (!sparepart) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "Server with that ID not found",
    //   });
    // }

    res.status(200).json({
      status: "success",
      spareparts,
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
    const result = await JobCardSpare.destroy({
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
