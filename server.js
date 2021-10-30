const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const webrtc = require("wrtc");
const { config } = require('./config')

const socket = require('socket.io')


app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/consumer", async ({ body }, res) => {
//     console.log("call 2");
//     const peer = new webrtc.RTCPeerConnection({
//         iceServers: [
//             {
//                 urls: "stun:stun.stunprotocol.org"
//             }
//         ]
//     });
//     const desc = new webrtc.RTCSessionDescription(body.sdp);
//     await peer.setRemoteDescription(desc);
//     try {
//         senderStream["abc"].getTracks().forEach(track => peer.addTrack(track, senderStream["abc"]));
//     } catch (error) {
//         console.log(error);
//     }

//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     const payload = {
//         sdp: peer.localDescription
//     }
//     res.json(payload);
// });

// app.post('/broadcast', async ({ body }, res) => {
//     console.log("call");
//     const peer = new webrtc.RTCPeerConnection({
//         iceServers: [
//             {
//                 urls: "stun:stun.stunprotocol.org"
//             }
//         ]
//     });
//     peer.ontrack = (e) => handleTrackEvent(e, peer);
//     const desc = new webrtc.RTCSessionDescription(body.sdp);
//     await peer.setRemoteDescription(desc);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     const payload = {
//         sdp: peer.localDescription
//     }
//     res.json(payload);
// });

function handleTrackEvent(e, peer) {
    senderStream["abc"] = e.streams[0];
};

function handleScreenTrackEvent(e,peer){
    screens["abc"] = e.streams[0]
}


const server = app.listen(5000, () => console.log('server started'));

const io = require("socket.io")(server);


// socket IO
// const io = socket(server, {
//     cors: true,
//     origins:['http://localhost:5000']
// })

let senderStream = new Map()
let screens = new Map()

io.on('connection',(client) =>{
    
    client.on('join', (roomid) =>{
        
        client.join(roomid) 

    })

    client.on('getvideostream',async(e)=>{
        const peer = new webrtc.RTCPeerConnection(config);
        const desc = new webrtc.RTCSessionDescription(e.body.sdp);
        await peer.setRemoteDescription(desc);
        try {
            senderStream[e.roomid].getTracks().forEach(track => peer.addTrack(track, senderStream[e.roomid]));
        } catch (error) {
            console.log(error);
        }
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }

        io.in(e.roomid).emit('videostream',{payload:payload})
        
    })

    client.on('getscreen',async(e)=>{
        const peer = new webrtc.RTCPeerConnection(config);
        const desc = new webrtc.RTCSessionDescription(e.body.sdp);
        await peer.setRemoteDescription(desc);
        try {
            screens[e.roomid].getTracks().forEach(track => peer.addTrack(track, screens[e.roomid]));
        } catch (error) {
            console.log(error);
        }
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload = {
            sdp: peer.localDescription
        }

        io.in(e.roomid).emit('screenstream',{payload:payload})
        
    })


    client.on('publishstream',async({ roomid, payload }) =>{

        const peer = new webrtc.RTCPeerConnection(config);
  
        peer.ontrack = (e) => handleTrackEvent(e, peer);
        const desc = new webrtc.RTCSessionDescription(payload.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload2 = {
            sdp: peer.localDescription
        }
        client.broadcast.to(roomid).emit('alert',{message:"reload"})
        io.in(roomid).emit('offer',payload2)
    })


    client.on('publishscreen',async({ roomid, payload }) =>{

        const peer = new webrtc.RTCPeerConnection(config);
  
        peer.ontrack = (e) => handleScreenTrackEvent(e, peer);
        const desc = new webrtc.RTCSessionDescription(payload.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload2 = {
            sdp: peer.localDescription
        }
        
        io.in(roomid).emit('screenoffer',payload2)
        client.broadcast.to(roomid).emit('screenalert',{ message : "Screen Is begin presented"})
    })

    client.on('chat',(e) =>{
        client.broadcast.to(e.roomid).emit('hi',{message:e.message})
    })


    client.on('message',({message, roomid})=>{
        client.broadcast.to(roomid).emit('newmessage',{message:message})
    })

})