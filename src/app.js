const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload');

//rutas
const routes = require("./routes/cv.routes");
const userRoutes = require("./routes/users.routes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(fileUpload());
app.use(express.json())

app.use("/api", routes);
app.use("/api", userRoutes)

module.exports = app;
