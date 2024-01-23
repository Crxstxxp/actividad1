const connect = require("../db");
const path = require("path");
const fs = require("fs");

const getCvs = async (req, res) => {
  const conn = await connect();
  const [rows] = await conn.query("SELECT * FROM cv");
  res.send(rows);
};

const postCv = async (req, res) => {
  // console.log(req.files);
  const { file } = req.files;
  const uploadPath = __dirname + "/../uploads/" + file.name;
  await file.mv(uploadPath);

  const newCv = { ruta: uploadPath };
  const conn = await connect();
  const [result] = await conn.query("INSERT INTO cv SET ?", [newCv]);

  return res.json({
    message: "Creado exitosamente",
    path: uploadPath,
    databaseResult: result,
  });
};

const getCvFile = async (req, res) => {
  const { id } = req.params;

  const conn = await connect();
  const [result] = await conn.query("SELECT ruta FROM cv WHERE id = ?", [id]);

  const filePath = result[0].ruta;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${path.basename(filePath)}`
  );

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};

const updateCv = async (req, res) => {
  const { id } = req.params;
  const { file } = req.files;

  const conn = await connect();

  const [existingCv] = await conn.query("SELECT * FROM cv WHERE id = ?", [id]);

  if (existingCv.length === 0) {
    return res.status(404).json({ message: "CV no encontrado" });
  }

  const oldFilePath = existingCv[0].ruta;

  // console.log(oldFilePath)

  try {
    await fs.promises.unlink(oldFilePath);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el archivo antiguo", error });
  }

  const uploadPath = __dirname + "/../uploads/" + file.name;
  await file.mv(uploadPath);

  const updatedCv = { ruta: uploadPath };

  const [result] = await conn.query("UPDATE cv SET ? WHERE id = ?", [
    updatedCv,
    id,
  ]);

  return res.json({
    message: "CV actualizado exitosamente",
    databaseResult: result,
  });
};

const deleteCv = async (req, res) => {
  const { id } = req.params;

  const conn = await connect();
  const [existingCv] = await conn.query("SELECT * FROM cv WHERE id = ?", [id]);

  if (existingCv.length === 0) {
    return res.status(404).json({ message: "CV no encontrado" });
  }

  const filePath = existingCv[0].ruta;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el archivo", error });
  }

  const [result] = await conn.query("DELETE FROM cv WHERE id = ?", [id]);

  return res.json({
    message: "CV eliminado exitosamente",
    databaseResult: result,
  });
};

module.exports = {
  getCvs,
  postCv,
  getCvFile,
  updateCv,
  deleteCv,
};
