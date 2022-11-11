import mongoose from "mongoose";
import Paciente from "../models/Paciente.js";


const agregarPaciente = async (req, res) => {
   
    const paciente = new Paciente(req.body)// Creamos la nueva instancia de paciente con los datos ingresados a traves del formulario (req.body)
    paciente.veterinario = req.veterinario._id // Es la variable del middleware que tiene el veterinario logueado. se la asignamos al modelo del paciente
    try {
        const pacienteAlmacenado = await paciente.save()
        return res.status(200).json(pacienteAlmacenado)
        
        
    } catch (error) {
        console.log(error) 
        
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario)

    res.json(pacientes)

};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id)
    
    if (!paciente) {
        res.status(404).json({ msg:' No encontrado' })
        
    }
    //Comprobamos si ese paciente fue agregado por el veterinario que fue autenticadp
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { // Lo pasamos a subString porque los ._id son Objetc id 
        return res.json({msg: 'Accion no valida'})
        
    }

   
    res.json(paciente)

};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        res.status(404).json({ msg:' No encontrado' })
        }
    
    
    //Comprobamos si ese paciente fue agregado por el veterinario que fue autenticadp
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { // Lo pasamos a subString porque los ._id son Objetc id 
        return res.json({msg: 'Accion no valida'})
    }

    
    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas
    

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
        
    }
        
    

};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Id no válido');
        return res.status(403).json({ msg: error.message });
    }
    const paciente = await Paciente.findById(id)

    if (!paciente) {
        res.status(404).json({ msg:' No encontrado' })
        }
    
    
    //Comprobamos si ese paciente fue agregado por el veterinario que fue autenticadp
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { // Lo pasamos a subString porque los ._id son Objetc id 
        return res.json({msg: 'Accion no valida'})
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'})
        
    } catch (error) {
        console.log(error)
        
    }

};

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}