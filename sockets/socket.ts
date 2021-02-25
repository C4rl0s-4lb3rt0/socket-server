import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../clases/usuarios-lista';
import { Usuario } from '../clases/usuario';



export const usuariosConectados = new UsuariosLista();




export const conectarCliente = ( cliente:Socket , io:socketIO.Server ) => {
     const usuario = new Usuario(cliente.id)
     usuariosConectados.agregar( usuario )

}


export const desconectar = ( cliente: Socket, io: socketIO.Server) => {


     cliente.on('disconnect', () => {
          console.log('Cliente Desconectado');
          usuariosConectados.borrarUsuario( cliente.id );

           
     })
}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io:socketIO .Server) => {

     cliente.on('mensaje', ( payload: { de:string, cuerpo:string }) => {
          console.log('Mensaje Recibido', payload)

          io.emit('usuarios-activos', usuariosConectados.getLista() );
          io.emit('mensaje-nuevo',payload ); 
     });
}

// Configurar Usuario
export const configurarUsuario = ( cliente: Socket, io:socketIO .Server) => {

     cliente.on('configurar-usuario', ( payload: { nombre : string }, callback : Function) => {
          // console.log('Configurando  Usuario', payload.nombre)

          usuariosConectados.actualizarNombre( cliente.id , payload.nombre );
          io.emit('usuarios-activos', usuariosConectados.getLista() );
   
          // io.emit('mensaje-nuevo',payload ); 
          callback({
               ok: true,
               mensaje: `Usuario ${ payload.nombre }, configurado`
          })
     });
}

// Obtener Usuarios

export const obtenerUsuarios = ( cliente: Socket, io:socketIO .Server) => {

     cliente.on('obtener-usuarios', ()  => {
          
          io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );
   
     });
}