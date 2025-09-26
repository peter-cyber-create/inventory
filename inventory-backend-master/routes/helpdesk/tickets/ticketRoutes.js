import express from "express";
import multer from "multer";
import xlsx from 'xlsx'
import User from "../../../models/users/userModel.js";
import transporter from "../../../config/email.js";
import TicketModel from "../../../models/helpdesk/tickets/ticketModel.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file && req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const ticketData = {
      ...req.body,
      ...(imageUrl && { imageUrl })
    };

    const ticket = await TicketModel.create(ticketData);
    const maillist = 'frank.mwesigwa1@gmail.com, inassazi@gmail.com, mkussipa@gmail.com';

    const mailOptions = {
      from: 'frank.mwesigwa1@gmail.com',
      to: maillist,
      subject: 'MOH HelpDesk - New Ticket Created',
      text: `A New Ticket with Ticket Number: ${ticket.id} has been created. - ${ticket.description}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Comment added and email sent');
      }
    });

    res.status(201).json({
      status: "success",
      ticket
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    await TicketModel.bulkCreate(data.map(row => ({
      reportedby: row.reportedby,
      priority: row.priority,
      level: row.level,
      facility: row.facility,
      category: row.category,
      module: row.module,
      emrtype: row.emrtype,
      phoneno: row.phoneno,
      description: row.description,
      agentId: row.agentId,
      image: row.image,
      system: row.system,
      dhis2instance: row.dhis2instance,
      dhis2module: row.dhis2module,
    })));

    res.status(200).send('File uploaded and data saved');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.system && { system: req.query.system }),
      ...(req.query.level && { level: req.query.level }),
      ...(req.query.facility && { facility: req.query.facility }),
    };

    const hasFilters = Object.keys(filters).length > 0;
    const whereCondition = hasFilters ? filters : {};

    const totalRecords = await TicketModel.count({ where: whereCondition });
    const totalPages = Math.ceil(totalRecords / limit);

    const tickets = await TicketModel.findAll({
      where: whereCondition,
      limit,
      offset: skip,
      include: [{ model: User }],
    });

    res.status(200).json({
      status: "success",
      results: tickets.length,
      tickets,
      totalRecords,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/count", async (req, res) => {
  try {
    const tickets = await TicketModel.findAll();

    let open = 0;
    let closed = 0;
    let inprogress = 0;
    let overdue = 0;

    tickets.forEach((ticket) => {
      switch (ticket.status) {
        case "inprogress":
          inprogress++;
          break;
        case "closed":
          closed++;
          break;
        case "open":
          open++;
          break;
        case "overdue":
          overdue++;
          break;
        default:
          break;
      }
    });

    res.status(200).json({
      status: "success",
      results: tickets.length,
      tickets,
      statusCounts: {
        open: open,
        closed: closed,
        inprogress: inprogress,
        overdue: overdue,
      },
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
    const result = await TicketModel.update(
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
        message: "Ticket with that ID not found",
      });
    }

    const ticket = await TicketModel.findByPk(req.params.id);

    const maillist = 'frank.mwesigwa1@gmail.com, inassazi@gmail.com, mkussipa@gmail.com';

    const mailOptions = {
      from: 'frank.mwesigwa1@gmail.com',
      to: maillist,
      subject: 'MOH HelpDesk - Ticket Updated',
      text: `The ticket with Ticket Number: ${ticket.id} has been updated. - ${ticket.description}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          status: "success",
          ticket,
          message: 'Ticket updated and email sent',
        });
      }
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
    const ticket = await TicketModel.findByPk(req.params.id, { include: [{ model: User }] });

    if (!ticket) {
      return res.status(404).json({
        status: "fail",
        message: "Ticket with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      ticket,
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
    const result = await TicketModel.destroy({
      where: { id: req.params.id },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Ticket with that ID not found",
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