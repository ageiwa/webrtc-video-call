const WebSocketServer = require('websocket').server
const http = require('http')

const server = http.createServer((request, response) => {

})
server.listen(1337, () => console.log('Сервер запущен'))

const wsServer = new WebSocketServer({
    httpServer: server
})

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin)

    connection.on('message', msg => {
        const self = JSON.parse(msg.utf8Data)
        connection.send(self)

        console.log(self)
    })
})