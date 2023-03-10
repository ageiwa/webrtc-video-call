const socket = new WebSocket('ws://localhost:3000')
const pc = new RTCPeerConnection()
const peerConnectionConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
const user = { id: null, name: null }

const btnCall = document.querySelector('#start-call')

btnCall.addEventListener('click', sendOffer)

socket.onmessage = msg => {
    const data = JSON.parse(msg.data)
    
    if (data.type === 'login') login(data.id, data.name)
    else if (data.msg.type === 'offer') sendAnswer(data.msg)
    else if (data.msg.type === 'answer') acceptAnswer(data.msg)
    else if (data.msg.candidate) {
        pc.addIceCandidate(new RTCIceCandidate(data.msg))
        .catch(e => console.log('Ошибка передачи изобаржения'))
    }
}

socket.onclose = e => {
    
}

function sendOffer() {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        const myVideo = document.querySelector('#my')
        myVideo.srcObject = stream

        pc.addStream(stream)

        pc.createOffer((offer) => {
            pc.setLocalDescription(offer, () => {
                const obj = {
                    userId: user.id,
                    msg: offer
                }
    
                socket.send(JSON.stringify(obj))
            }, e => console.log(e))
        }, e => console.log(e))
    })
}

function sendAnswer(data) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        const myVideo = document.querySelector('#my')
        myVideo.srcObject = stream

        pc.addStream(stream)

        pc.setRemoteDescription(new RTCSessionDescription(data), () => {
            pc.createAnswer(answer => {
                pc.setLocalDescription(answer, () => {
                    const obj = {
                        userId: user.id,
                        msg: answer
                    }
    
                    socket.send(JSON.stringify(obj))
                })
            }, e => console.log(e))
        }, e => console.log(e))
    })
}

function acceptAnswer(data) {
    pc.setRemoteDescription(new RTCSessionDescription(data), () => {

    }, e => console.log(e))
}

function login(id, name) {
    user.id = id
    user.name = name

    console.log(user)
}

pc.onicecandidate = e => {
    if (e.candidate !== null) {
        const obj = {
            userId: user.id,
            msg: e.candidate
        }

        socket.send(JSON.stringify(obj))
    }
}

pc.onaddstream = e => {
    const notMyVideo = document.querySelector('#notMy')
    notMyVideo.srcObject = e.stream
}