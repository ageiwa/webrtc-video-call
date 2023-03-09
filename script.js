const socket = new WebSocket('ws://127.0.0.1:1337')
const pc = new RTCPeerConnection()
const peerConnectionConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]}
const startCallBtn = document.querySelector('#start-call')

startCallBtn.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        const myVideo = document.querySelector('#my')
        myVideo.srcObject = stream

        sendOffer()
    })
})

socket.onmessage = msg => {
    console.log(msg)

    // pc.setRemoteDescription(new RTCSessionDescription(msg), () => {
    //     pc.createAnswer(answer => {
    //         pc.setLocalDescription(new RTCSessionDescription(answer), () => {
    //             // send answer
    //             socket.send(answer)
    //         })
    //     })
    // })
}

pc.onaddstream = e => {
    const myVideo = document.querySelector('#my')
    myVideo.srcObject = e.stream
}

function sendOffer() {
    pc.createOffer((offer) => {
        pc.setLocalDescription(offer, () => {
            socket.send(JSON.stringify(offer))
        }, error => console.log(error))
    }, error => console.log(error))
}

// function sendAnswer() {
//     navigator.mediaDevices.getUserMedia({video: true})
//     .then(stream => {
//         const myVideo = document.querySelector('#my')
//         myVideo.srcObject = stream

//         pc.setRemoteDescription(new RTCSessionDescription(offer), () => {
//             pc.createAnswer(answer => {
//                 pc.setLocalDescription(new RTCSessionDescription(answer), () => {
//                     // send answer
//                 })
//             })
//         })
//     })
// }