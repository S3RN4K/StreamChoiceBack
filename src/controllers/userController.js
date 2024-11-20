const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const db = require("../config/db"); // Asegúrate de importar la conexión correctamente

const registerUser = async (req, res) => {
    const { nombre, email, contraseña, es_premium } = req.body
  
    // Validar campos obligatorios
    if (!nombre || !email || !contraseña || typeof es_premium === "undefined") {
      return res.status(400).json({ message: "Todos los campos son obligatorios" })
    }
  
    try {
      // Insertar el usuario en la base de datos
      const [result] = await db.execute(
        `INSERT INTO Usuarios (nombre, email, contraseña, es_premium) 
        VALUES (?, ?, ?, ?)`,
        [nombre, email, contraseña, es_premium]
      )
  
      res.status(201).json({ message: "Usuario registrado con éxito", userId: result.insertId })
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      res.status(500).json({ message: "Error al registrar usuario" })
    }
  }

const loginUser = async (req, res) => {
    const { email, contraseña } = req.body; // Asegúrate de que el frontend envíe estos nombres correctamente
  
    // Verifica si ambos campos están presentes
    if (!email || !contraseña) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }
  
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Usuarios WHERE email = ? LIMIT 1",
        [email]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const usuario = rows[0];
  
      if (usuario.contraseña !== contraseña) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
  
      res.status(200).json({
        message: "Login exitoso",
        user: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          email: usuario.email,
          es_premium: usuario.es_premium,
        },
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
};  


module.exports = {
    registerUser,
    loginUser,
};
