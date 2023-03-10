document.addEventListener('DOMContentLoaded',() => {

    const userGrid = document.querySelector('.grid-user')
    const cpuGrid = document.querySelector('.grid-cpu')
    const displayGrid = document.querySelector('.grid-display')

    const ships = document.querySelectorAll('.ship')

    const destroyer = document.querySelector('destroyer-container')
    const submarine = document.querySelector('submarine-container')
    const cruiser = document.querySelector('cruiser-container')
    const battleship = document.querySelector('battleship-container')
    const carrier = document.querySelector('carrier-container')

    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#turn')
    const infoDisplay = document.querySelector('#info')

    const setupButtons = document.getElementById('setup-buttons')

    const width = 10
    const userSquares = []
    const cpuSquares = []

    let isGameOver = false
    let ready = false
    let enemyReady = false
    let allShipsPlaced = false
    let playerNum = 0
    let shotsFired = -1
    let currentPlayer = 'user'
    let isHorizontal = true

    const shipsArray = [
        {
            name:'destroyer',
            directions:[
                [0,1],
                [0,width]
            ]
        },
        {
            name:'submarine',
            directions:[
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name:'cruiser',
            directions:[
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name:'battleship',
            directions:[
                [0,1,2,3],
                [0,width,width*2,width*3]
            ]
        },
        {
            name:'carrier',
            directions:[
                [0,1,2,3,4],
                [0,width,width*2,width*3,width*4]
            ]
        },
    ]

    createBoard(userGrid,userSquares)
    createBoard(cpuGrid,cpuSquares)

    function createBoard(grid,squares){
        for(let i = 0; i < width * width ; i++){
            const square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            squares.push(square)
        }
    }

    //para definir los turnos
    function playGameSingle(){
        if (isGameOver) return
        if (currentPlayer === 'user'){
            turnDisplay.innerHTML = "Tu turno"
            cpuSquares.forEach(square => square.addEventListener('click', (e) => {
                shotFired = square.dataset.id
                revealSquare(square.classList)
            }))
        }
        if(currentPlayer === 'enemy'){
            turnDisplay.innerHTML = "Turno enemigo"
            setTimeout(enemyGo, 1000)
        }
    }

    if (gamemode === 'singlePlayer')
        startSinglePlayer()
    else
        startMultiplayer()

    //esto es para la computadora
    function generate(ship){
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if(randomDirection === 0) directions = 1
        if(randomDirection === 1) directions = 10 //por el width
        let randomStart = Math.abs(Math.floor(Math.random() * cpuSquares.length - (ship.directions[0].length * direction)))
        
        const isTaken = current.some(index => cpuSquares[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (index) % width === width - 1)
        const isAtLeftEdge = current.some(index => (index) % width === 0)

        if(!isTaken && !isAtLeftEdge && !isAtRightEdge)
            current.forEach(index => cpuSquares[randomStart + index].classList.add('taken',ship.name));
    
        else generate(ship)
    }
    
    function startSinglePlayer(){
 
    }   

    function startMultiplayer(){
        const socket = io() // este esta declarado en el HTML MP

        socket.on('player-number', num => {
            if (num === -1){
                infoDisplay.innerHTML = "El servidor esta lleno"
            }
            else{
                playerNum = parseInt(num)
                if(playerNum === 1) currentPlayer = "enemy"

                console.log(playerNum)

                socket.emit('check-players')
            }
        })

        socket.on('player-connection', num => {
            console.log(`Jugador ${num} se conecto`)

            playerIsConnected(num)
        })

        socket.on('enemy-ready', num => {
            enemyReady = true;
            playerReady(num)
            if (ready){
                //playGameMulti(socket)
                setupButtons.style.display = 'none'
            }
        })

        socket.on('check-players', players => {
            players.forEach(player, i => {
                if(player.connected) playerIsConnected(i)
                if(player.ready) {
                    playerReady(i)
                    if (i !== playerReady) enemyReady = true
                }
            })
        })

        socket.on('timeout', () => {
            infoDisplay.innerHTML = "te quedaste AFK wey"
        })

        startButton.addEventListener('click', () => {
            if(allShipsPlaced){
                //playGameMulti(socket)
                console.log("Que comiense el juego jiji")
            }
            else{
                infoDisplay.innerHTML = "Faltan asignar barquitos"
            }
        })

        cpuSquares.forEach(square => {
            square.addEventListener('click', () => {
                if (currentPlayer === 'user' && ready && enemyReady){
                    shootFire = square.dataset.id
                    socket.emit('fire', shootFire)
                }
            })
        })

        socket.on('fire', id => {
            enemyGo(id)
            const square = userSquares[id]
            socket.emit('fire-reply', square.classList)
        })

        socket.on('fire-reply', classlist => {
            //function revelar el square
            //playGameMulti(socket)
        })

    }

    function playerReady(_num){
        let player = `p${parseInt(_player) + 1 }`
        document.querySelector(`${player} .ready`).classList.toggle('active')
    }
    
    function playerIsConnected(_player){
        let player = `p${parseInt(_player) + 1 }`
        document.querySelector(`${player} .connected`).classList.toggle('active')

        if (parseInt(num) === playerNum){
            document.querySelector(player).style.fontWeight = bold;
        }
    }
})

