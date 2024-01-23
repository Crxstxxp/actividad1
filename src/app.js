const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload');

//rutas
const routes = require("./routes/cv.routes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(fileUpload());

app.use("/api", routes);

module.exports = app;
