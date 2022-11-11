import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';


const checkAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ) { // El Bearer se usa por convencion
        console.log('Si tiene el token con bearer');
    
    try {
        token = req.headers.authorization.split(' ')[1]// Esto lo hacemos para que tome solo la parte del token y saque el bearer
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); // Con req.veterinario le asignamos el valor directamente a express

        return next()
        
    } catch (error) {
        const e = new Error('Token no valido ');
       return res.status(403).json({ msg: e.message })
    }
} 

    if (!token) {
    const error = new Error('Token no valido o inexistente');
    res.status(403).json({ msg: error.message })
    
    }


    next();

};

export default checkAuth