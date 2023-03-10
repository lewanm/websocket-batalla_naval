const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socket = require('socket.io')
const app = express();
const server = http.createServer(app)
const io = socket(server)

//esto es para usar lo de la carpeta publica como static
app.use(express.static(path.join(__dirname,"public")));

server.listen(PORT,() => {
    console.log(`el server corre en https://localhost:${PORT}`)
})

const connections = [null,null]

io.on('connection', socket =>{
    let playerIndex = -1
    for( const i in connection){
        if (connections[i] === null){
            playerIndex = i
            break;
        }
    }

    socket.emit("player-number", playerIndex)

    console.log(`Jugador ${playerIndex} se ha conectado`)

    if(playerIndex === -1) return
    connections[playerIndex] = false

    //este le va a llegar atodos los que esten conectados
    socket.broadcast.emit('player-connection:',playerIndex)

    socket.on('disconnect', () =>{
        console.log(`Jugador ${playerIndex} se ha desconectado`)
        connections[playerIndex] = null
        socket.broadcast.emit('player-connection:',playerIndex)
    })

    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true;
    })

    socket.on('check-players', () => {
        const player = []
        for (const i in connections){
            connections[i] === null ? 
            players.push({connected : false, ready: false}) :
            players.push({connected : true, ready: connections[i]})
        }
        socket.emit('check-players', players)
    })

    socket.on('fire', id => {
        console.log(`Disparo de ${playerIndex}`,id)
        socket.broadcast.emit('fire',id)
    })

    socket.on('fire-reply', square => {
        console.log(square)
        socket.broadcast.emit('fire-reply', square)
    })

    setTimeout(() => {
        connections[playerIndex] = null;
        socket.emit('timeout')
        socket.disconnect()
    }, 1000*60*2) //solo pa ver si esta AFK 2 minutos
})