const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const registerUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    // Validar que todos los campos están presentes
    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const userId = await userModel.createUser(nombre, email, contraseña);
        res.status(201).json({ message: 'Usuario creado con éxito', userId });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { email, contraseña } = req.body;

    // Validar que los datos sean proporcionados
    if (!email || !contraseña) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {
        // Buscar al usuario en la base de datos
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id_usuario, email: user.email, es_premium: user.es_premium },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token válido por 1 hora
        );

        // Responder con el token
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                email: user.email,
                es_premium: user.es_premium,
            },
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
