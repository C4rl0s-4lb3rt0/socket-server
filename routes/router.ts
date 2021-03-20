import { Router, Request, Response } from 'express';
import Server from '../clases/server';
import { usuariosConectados, mapa } from '../sockets/socket';
import { graficaData } from '../clases/grafica';


const router = Router();

const grafica = new graficaData();  




// mapa

router.get('/mapa', ( req:Request, res:Response )  => {

     res.json( mapa.getMarcadores() ) 
})


// graficas
router.get('/grafica', ( req:Request, res:Response )  => {

     res.json( grafica.getDataGrafica() ) 
})


router.post('/grafica', ( req:Request, res:Response )  => {
     
     const mes          = req.body.mes;
     const unidades     =  Number(req.body.unidades);

     grafica.incrementarValor( mes, unidades );

     const server = Server.instance;
     server.io.emit('cambio-grafica', grafica.getDataGrafica() );


     res.json( 
          grafica.getDataGrafica()
     );
})

export default router;