const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const webrtc = require("wrtc");
const { config } = require('./config')
const { setToken } = require('./auth/auth')
const redis = require('redis');
const path = require('path')

const socket = require('socket.io')
const bcrypt = require('bcrypt');
const redisClient = redis.createClient({
    host:'localhost',
    port: 6379
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));
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


const server = app.listen(5000, () => console.log('server started'));

// auth
app.post('/auth', async(req, res) => {
    const { roomid, passcode } = req.body
    redisClient.get(roomid,(err, reply) => {
        if(err) {
            console.log(err);
        }
        if(reply) {
            reply = JSON.parse(reply)
            if(reply.passcode == passcode) {
                res.json({
                    status: true,
                    message: "success"
                })
            } else {
                res.json({
                    status: false,
                    message: "wrong passcode"
                })
            }
        } else {
            res.json({
                status: false,
                message: "room not found"
            })
        }
    })
});

app.post('/room',async(req,res)=>{
    const { roomid } = req.body
    redisClient.setex(roomid,86400,JSON.stringify(req.body))
    res.send({message:"done"})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


const io = require("socket.io")(server);


// socket IO
// const io = socket(server, {
//     cors: true,
//     origins:['http://localhost:5000']
// })

let senderStream = new Map()
let screens = new Map()


function handleTrackEvent(e, peer,roomid) {
    senderStream[roomid] = e.streams[0];
    
};

function handleScreenTrackEvent(e, peer, roomid) {
    screens[roomid] = e.streams[0]
}



io.on('connection', (client) => {

    client.on('join', (roomid) => {

        client.join(roomid)

    })

    client.on('getvideostream', async (e) => {
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

        setTimeout(() => {
            io.in(e.roomid).emit('videostream', { payload: payload })
        }, 2000);
       

    })

    client.on('getscreen', async (e) => {
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
        setTimeout(() => {
            io.in(e.roomid).emit('screenstream', { payload: payload })
        }, 2000);
        

    })


    client.on('publishstream', async ({ roomid, payload }) => {

        const peer = new webrtc.RTCPeerConnection(config);

        peer.ontrack = (e) => handleTrackEvent(e, peer, roomid);
        const desc = new webrtc.RTCSessionDescription(payload.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload2 = {
            sdp: peer.localDescription
        }
        client.broadcast.to(roomid).emit('alert', { message: "reload" })
        io.in(roomid).emit('offer', payload2)
    })


    client.on('publishscreen', async ({ roomid, payload }) => {

        const peer = new webrtc.RTCPeerConnection(config);

        peer.ontrack = (e) => handleScreenTrackEvent(e, peer, roomid);
        const desc = new webrtc.RTCSessionDescription(payload.sdp);
        await peer.setRemoteDescription(desc);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        const payload2 = {
            sdp: peer.localDescription
        }

        io.in(roomid).emit('screenoffer', payload2)
        setTimeout(() => {
            client.broadcast.to(roomid).emit('screenalert', { message: "Screen Is begin presented" })
        }, 2000);
        
    })

    client.on('chat', (e) => {
        client.broadcast.to(e.roomid).emit('hi', { message: e.message })
    })


    client.on('message', ({ name, message, roomid }) => {
        console.log(name);
        client.broadcast.to(roomid).emit('newmessage', { name:name, message: message })
    })

})