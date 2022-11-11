import express from "express";
import { actualizarPaciente, agregarPaciente, eliminarPaciente, obtenerPaciente, obtenerPacientes } from "../controllers/pacienteControllers.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// Pasamos el middleware de checkauth en agregarpaciente. Esto es porque el usuario tiene que estar autenticado para registrar a sus pacientes. Ademas permite capturar la variable req.veterinario
router
    .route('/')
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes) 

router.
    route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)    

export default router