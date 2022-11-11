import nodemailer from 'nodemailer';
import 'dotenv/config'


const emailRegistro = async (datos) => {
  const {email, nombre, token} = datos;

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });   

      //Enviar el email

      const info = await transport.sendMail({
        from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>', // sender address
        to: email, // list of receivers
        subject: "APV - Comprueba tu cuenta ✔", // Subject line
        text: "Comprueba tu cuenta APV", // plain text body
        html: ` <p> Hola <strong>${nombre}</strong> <br /> Comprueba tu cuenta</p>
        <p>Hace falta solo un paso para confirmar tu cuenta, haz click en el siguiente enlace: 
        <a href='${process.env.FRONTEND_URL}/confirmar/${token}'>Comprobar Cuenta</a>
        </p>
        
        <p>Si no creaste esta cuenta puedes eliminar este mensaje</p>
 
        `, // html body
      });
 
    console.log('Mensaje enviado: %s', info.messageId);
};
 
export default emailRegistro;