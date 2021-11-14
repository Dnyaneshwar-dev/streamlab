import React from 'react'
import ReceiverSidebar from './ReceiverSidebar';
import { Container, Box } from '@mui/material';
import { useEffect, useState } from 'react'
import { useRef } from 'react';
import axios from 'axios'
import { socket } from './socketConnection';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons } from 'react-chat-widget';
import config from './config';
import 'react-chat-widget/lib/styles.css';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import adapter from 'webrtc-adapter';


const Receiver = () => {
    const history = useHistory();
    const senderVideo = useRef(null)
    const senderScreen = useRef(null)

    const [loaded,setLoad] = useState(true)



    useEffect(() => {
        const p = new URLSearchParams(window.location.hash.substring(6))

        const roomid = p.get('roomid')
        const passcode = p.get('passcode')
        const name = p.get('name')
        localStorage.setItem('name',name)
        console.log(roomid,passcode);

        const getToken = async () => {
            const token = await axios.post('http://localhost:5000/auth', {

                roomid: String(roomid),
                passcode: String(passcode)

            })
            return token.data.status
        }
        const auth = async() =>{
            const token = await getToken()
            console.log(token);
            if (token == false) {
                history.push('/')
                return
            }
        }

        auth()
        
        socket.emit('join', roomid)

        let peer
        let peer2


        const setMedia = async () => {

            peer = createPeer()
            peer.addTransceiver("video", { direction: "recvonly" })
            peer.addTransceiver("audio", { direction: "recvonly" })

            function createPeer() {
                const peer = new RTCPeerConnection(config);
                peer.ontrack = handleTrackEvent;
                peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

                return peer;
            }

            function handleTrackEvent(e) {
                senderVideo.current.srcObject = e.streams[0]

            };

            async function handleNegotiationNeededEvent(peer) {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                const payload = {
                    sdp: peer.localDescription
                };

                //const { data } = await axios.post('http://localhost:5000/consumer', payload);
                //console.log('data',data);
                socket.emit('getvideostream', { roomid: roomid, body: payload })

                //const desc = new RTCSessionDescription(data.sdp);
                //peer.setRemoteDescription(desc).catch(e => console.log(e));

            }

        }
        setMedia()

        const setScreen = async () => {

            peer2 = createPeer()
            peer2.addTransceiver("video", { direction: "recvonly" })
            peer2.addTransceiver("audio", { direction: "recvonly" })

            function createPeer() {
                const peer = new RTCPeerConnection(config);
                peer.ontrack = handleTrackEvent;
                peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

                return peer;
            }

            function handleTrackEvent(e) {
                senderScreen.current.srcObject = e.streams[0]

            };

            async function handleNegotiationNeededEvent(peer) {
                const offer = await peer.createOffer();
                await peer2.setLocalDescription(offer);
                const payload = {
                    sdp: peer.localDescription
                };

                socket.emit('getscreen', { roomid: roomid, body: payload })

            }

        }

        socket.on('hi', (message) => {
            console.log(message);
        })

        socket.on('videostream', async(e) => {
            console.log('video');
            const desc = new RTCSessionDescription(e.payload.sdp);
            //await peer.setRemoteDescription(desc).catch(e => console.log(e));
            setTimeout(async() => { await peer.setRemoteDescription(desc).catch(e => console.log(e));
                setLoad(false)
            }, 3000);

        })

        socket.on('screenstream', async(e) => {
            console.log('screen')

            const desc = new RTCSessionDescription(e.payload.sdp);

            setTimeout(async() => { await peer2.setRemoteDescription(desc).catch(e => console.log(e));
            }, 3000);
            
        })

        socket.on('screenalert', async(e) => {
            console.log(e.message);
            await setScreen()
        })

        socket.on('videoalert', (e) => {

        })

    }, [])

    return (
        <div>
            {
                loaded ?  <Box className="mx-auto" sx={{ margin:"auto", paddingTop:"10%", display:"flex-box" }}>
                <div className="text-center">
                <CircularProgress disableShrink/>
                <h3 className="text-center">Loading Please Wait...</h3>
                </div>
                
              </Box> : <></>
            } 
            <ReceiverSidebar open="false" />
        
            <video ref={senderVideo} autoPlay={true} muted={true} playsInline={true} controls={false} />
            <video ref={senderScreen} autoPlay={true} muted={true} playsInline={true} controls={false} />
            
        </div>
    );
}

export default Receiver
