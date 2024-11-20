const contentModel = require('../models/contentModel');

// Crear contenido
const createContent = async (req, res) => {
    const { titulo, tipo, duracion, descripcion, fecha_estreno, genero, imagen_url } = req.body;

    if (!titulo || !tipo || !duracion || !descripcion || !fecha_estreno || !genero || !imagen_url) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, incluida la imagen' });
    }

    try {
        const contentId = await contentModel.createContent(titulo, tipo, duracion, descripcion, fecha_estreno, genero, imagen_url);
        res.status(201).json({ message: 'Contenido creado con éxito', contentId });
    } catch (error) {
        console.error('Error al crear contenido:', error);
        res.status(500).json({ message: 'Error al crear contenido' });
    }
};

// Obtener todo el contenido
const getAllContent = async (req, res) => {
    try {
        const content = await contentModel.getAllContent();
        res.status(200).json(content);
    } catch (error) {
        console.error('Error al obtener contenido:', error);
        res.status(500).json({ message: 'Error al obtener contenido' });
    }
};

// Actualizar contenido
const updateContent = async (req, res) => {
    const { id } = req.params;
    const { titulo, tipo, duracion, descripcion, fecha_estreno, genero, imagen_url } = req.body;

    if (!titulo || !tipo || !duracion || !descripcion || !fecha_estreno || !genero || !imagen_url) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, incluida la imagen' });
    }

    try {
        const affectedRows = await contentModel.updateContent(
            id,
            titulo,
            tipo,
            duracion,
            descripcion,
            fecha_estreno,
            genero,
            imagen_url
        );
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Contenido no encontrado' });
        }
        res.status(200).json({ message: 'Contenido actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar contenido:', error);
        res.status(500).json({ message: 'Error al actualizar contenido' });
    }
};

// Eliminar contenido
const deleteContent = async (req, res) => {
    const { id } = req.params;

    try {
        const affectedRows = await contentModel.deleteContent(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Contenido no encontrado' });
        }
        res.status(200).json({ message: 'Contenido eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar contenido:', error);
        res.status(500).json({ message: 'Error al eliminar contenido' });
    }
};

module.exports = {
    createContent,
    getAllContent,
    updateContent,
    deleteContent,
};
