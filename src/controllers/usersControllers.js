const connect = require("../db");

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  const conn = await connect();

  try {
    const [result] = await conn.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (result.length > 0) {
      return res.json({ message: "Inicio de sesión exitoso" });
    } else {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error al realizar la consulta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  } 
};

module.exports = {
  login,
};
