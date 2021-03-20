import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../clases/usuarios-lista';
import { Usuario } from '../clases/usuario';
import { Mapa } from "../clases/mapa";
import { Marcador } from '../clases/marcador';



export const usuariosConectados = new UsuariosLista();
export const mapa = new Mapa();



// evento de mapa
export const mapaSockets = ( cliente:Socket , io:socketIO.Server ) => {
   

     cliente.on( 'marcador-nuevo', (marcador: Marcador) => {
          mapa.agregarMarcador( marcador )
          cliente.broadcast.emit( 'marcador-nuevo', marcador )
     });
     
     cliente.on( 'marcador-borrar', (id:string) => {
          mapa.borrarMarcador( id )
          cliente.broadcast.emit( 'marcador-borrar', id )
     });

     cliente.on( 'marcador-mover', (marcador :Marcador) => {
          mapa.moverMarcador( marcador )
          cliente.broadcast.emit( 'marcador-mover', marcador )
     });

}





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