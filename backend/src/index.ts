import "dotenv/config";
import "express-async-errors";
import { app } from "./app.js";
import { config } from "./config.js";

const port = config.port;
app.listen(port, () => console.log("IMS Backend listening on port " + port));
