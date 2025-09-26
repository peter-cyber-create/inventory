import express from "express";
import VSparePartsQty from "../../models/vehicles/vSpareQty.js";
import VSpareParts from "../../models/vehicles/vSpareParts.js";
import { sequelize } from "../../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { prevSpareQty, finalSpareQty, receivedSpareQty, spareId } = req.body;

 

    const result = await VSpareParts.update(
      { ...req.body, qty: String(finalSpareQty) },
      {
        where: {
          id: spareId,
        },
      },
      { transaction }
    );

    const sparepart = await VSparePartsQty.create(req.body, { transaction });

    await transaction.commit();

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

// router.get("/:id", async (req, res) => {
//   try {
//     const sparepart = await SparePart.findByPk(req.params.id);

//     if (!sparepart) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Server with that ID not found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       sparepart,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

export default router;
