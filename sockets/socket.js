const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioDesconectado, usuarioConectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    if (!valido) {
        return client.disconnect();
    }

    console.log('cliente autenticado');


    // cliente autenticado
    usuarioConectado(uid);


    // ingresar al usuario a una sala en particular
    // sala global, client.id
    client.join(uid);


    // escuchar el mensaje personal
    client.on('mensaje-personal', async(payload) => {

        console.log(payload);

        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);

    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

    /*
    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });
    */

});