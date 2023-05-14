import  express  from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();
 dotenv.config();

app.use(express.json()); // Para que express lea los json

conectarDB();

// const dominiosPertmitidos = [process.env.FRONTEND_URL]
const dominiosPertmitidos = ['https://veterinarios-mern.vercel.app']

const corsOptions = {
    origin: function(origin, callback) {
        if (dominiosPertmitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido
            callback(null, true)
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRoutes); // De esta forma accedo al router de veterinarios. app.tmb es una tura
app.use('/api/pacientes', pacienteRoutes); // De esta forma accedo al router de veterinarios. app.tmb es una tura

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servido funcionando en puerto ${PORT}`)
});


