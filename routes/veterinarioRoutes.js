import  express  from "express";
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

//Area publica
router.post('/', registrar);

router.get('/confirmar/:token', confirmar); // Con los : hacemos el parametro dinamico

router.post('/login', autenticar);

router.post('/olvide-password', olvidePassword); //para validar el email del usuario

// router.get('/olvide-password/:token', comprobarToken); //leer el token

// router.post('/olvide-password/:token', nuevoPassword) // hacer nuevo password

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword) // chaining

//Area privada
router.get('/perfil', checkAuth, perfil); // Ese checauth es un middleware que antes de ejecutar la funcion perfil, ejecuta el middleware
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password',checkAuth, actualizarPassword )
export default router
