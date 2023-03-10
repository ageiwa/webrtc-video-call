const WebScoket = require('ws')
const wss = new WebScoket.Server({ port: 3000 })
const users = []

wss.on('connection', (ws) => {
    const id = Math.random()

    connectUser(id, ws)

    ws.on('message', msg => {
        const data = JSON.parse(msg)

        console.log(data)

        const watcher = users.find(user => user.id !== data.userId)
        watcher.socket.send(JSON.stringify(data))
    })

    ws.on('close', msg => disconnectUser(id))
})

function connectUser(id, ws) {
    const user = {
        id: id,
        name: 'user ' + id,
        socket: ws
    }

    users.push(user)

    ws.send(JSON.stringify({id: user.id, name: user.name, type: 'login'}))
}

function disconnectUser(id) {
    const index = users.findIndex(user => user.id === id)
    users.splice(index, 1)
}