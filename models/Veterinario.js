import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()

    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { //Esto es propio de moongose. Es para evitar que hashee un password nuevamente
        next();
    }
    const salt = await bcrypt.genSalt(10) // Para hacer las rondas de hasheo de password
    this.password = await bcrypt.hash(this.password, salt)// Hasheamos el password del usuario
    
});

veterinarioSchema.methods.comprobarPassword = async function (passwordFormulario) { // Este metodo es para comprobar los password
    return await bcrypt.compare(passwordFormulario, this.password) // el this. es el password hasheado
    
}


const Veterinario = mongoose.model('Veterinario', veterinarioSchema) // esto registra el modelo. El segundo argumento que se pasa es el Schema

export default Veterinario;