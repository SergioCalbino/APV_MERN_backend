import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js";


const registrar = async (req, res) => {

    const { nombre, email, password } = req.body;

    //Prevenir o revisar usuario duplicados

    const existeUsuario = await Veterinario.findOne({email}); //Primero lo busco por email (ya que es unique, ver db) luego hago la logica

    if (existeUsuario) {
       // console.log(existeUsuario)
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message })// se usa el {msg para que luego lo puedas leer desde el front}
    }


    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save() //Metodo de moongose para guardar en la db

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token // viene del guardado de veterinario
        });

        res.json(veterinarioGuardado)

    } catch (error) {
        console.log(error)
        
    }

};

const perfil = (req, res) => {
    console.log(req.veterinario)
    const { veterinario } = req // Esto lo hacemos porque tenemos almacenado en la sesion de request el valor de veterinario
    res.json( veterinario )

};

const confirmar = async (req, res) => {
    // Leer el ":" se hace como req.params
   // console.log(req.params.token) // Como lo nombres en tu ruta es como lo tenes que llamar en el params. En este caso token lo llamamos
    
   const { token } = req.params

   const usuarioConfirmar = await Veterinario.findOne({token}); // Esto va a buscar ek usuario que tenga el token que nosostros pasamos por la url

   if (!usuarioConfirmar) { // Verificamos si el token pertenece a un usuario valido.
    const error = new Error('Token no valido');
    return res.status(404).json({msg: error.message});
    
   }

   try {
        usuarioConfirmar.token = null; // Para eliminar el token y luego que el usuario registrado pase a true, linea 56
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()

        res.json({ msg:'Usuario confirmado correctamente' })
   } catch (error) {
        console.log(error) 
    
   }

};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprobar si el usuario existe;

    const usuario = await Veterinario.findOne({email})

    if (!usuario) {
        const error = new Error('El Usuario no existe');
        return res.status(404).json({msg: error.message})
    }

   // Comprobar si el usuario esta confirmado
   if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message})
    
   }

   // Revisar el password
   if (await usuario.comprobarPassword(password)) {//Usuario es la instancia de veterinario. comprobarPassword es el metodo para comprobar passwor que definimos en el modelo de Veterinarios
        //autenticar
        
       res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token:  generarJWT(usuario.id),
        
       }) 
    
   } else {
    const error = new Error('El Password es incorrecto');
    return res.status(403).json({msg: error.message})
   }

};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email})
    
    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId()
            await existeVeterinario.save()

            //Enviar email con instrucciones
            emailOlvidePassword({
                email,
                nombre: existeVeterinario.nombre,
                token: existeVeterinario.token
            })

            res.json({msg: 'Hemos enviado un email con las instrucciones'})
        
    } catch (error) {
        console.log(error)
        
    }

    

};
const comprobarToken = async (req, res) => {
    const { token } = req.params;
    
    const tokenValido = await Veterinario.findOne({token})

    if (tokenValido) {
        //El token es valido, el usuario existe
        res.json({ msg: 'Token valido el usuario existe' })
        
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message })
    }

};
const nuevoPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token})

    if (!veterinario) {
        const error = new Error('Hubo un eror');
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.token = null;
        veterinario.password = password
         await veterinario.save()
         res.json({ msg: 'Password modificado correctamente' })
    } catch (error) {
        console.log(error)
        
    }

};

const actualizarPerfil = async (req, res) => {
    const { id } = req.params

    
        const { nombre, email, telefono, web } = req.body
        
        const veterinario = await Veterinario.findById(id)
        if (!veterinario) {
            const error = new Error('El id ingresado no existe')
           return res.status(400).json(error.message)
            
        }

        if (veterinario.email !== email) {
            const existeEmail = await Veterinario.findOne({email})
            if (existeEmail) {
                const error = new Error('El email ingresado se encuentra en uso')
                return res.status(400).json({msg: error.message})
            }
            
        }

        try {
            veterinario.nombre = nombre 
            veterinario.email = email 
            veterinario.telefono = telefono 
            veterinario.web = web 

            const veterinarioActualizado = await veterinario.save()
            return res.status(200).json(veterinarioActualizado)
            
        } catch (error) {
            console.log(error)
            
        }

}

const actualizarPassword = async (req, res) => {
    //Leer los datos

    const { id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    //Comprobar que el veterinario exista
   
        
    const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error('Hubo un error')
       return res.status(400).json(error.message)
        
    }

    //comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        
        veterinario.password = pwd_nuevo
        await veterinario.save();
        res.json({msg: 'Password almacenado correctamente'})
        
    } else {
        const error = new Error('El password actual es incorrecto')
       return res.status(400).json({msg:error.message})
        
    }

    //Almacenar el nuevo password

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}