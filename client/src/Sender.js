import React from 'react'
import SenderSidebar from './SenderSidebar';
import { Container, Box } from '@mui/material';
import { useEffect } from 'react'
import { useRef } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { PAYLOAD, VIDEOSTREAM } from './redux/actions';
import ReactPlayer from 'react-player' 
import { store } from './redux/store'
import config from './config';
import { socket } from './socketConnection';
import { useHistory } from 'react-router-dom';
import { Redirect } from "react-router-dom";
const Sender = () => {

    const videoRef = useRef()
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        
        const p = new URLSearchParams(window.location.hash.substring(6))

        const roomid = p.get('roomid')
        const passcode = p.get('passcode')
        const getToken = async () => {
            const token = await axios.post('http://localhost:5000/auth', {
                data: {
                    roomid: String(roomid),
                    passcode: String(passcode)
                }
            })
            return token.data.status
        }
        
        const token = await getToken()
        console.log(token);
        if (token == false) {
            history.push('/')
            return
        }
        socket.emit('join', roomid)

        let peer 

        const getMedia = async () => {

            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
            videoRef.current.srcObject = stream
            dispatch({ type: VIDEOSTREAM, data: stream })
            peer = createPeer()

            stream.getTracks().forEach(track => peer.addTrack(track,stream))
            
            function createPeer() {
                const peer = new RTCPeerConnection(config);
                peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

                return peer;
            }

            async function handleNegotiationNeededEvent(peer) {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                const payload = {
                    sdp: peer.localDescription
                };
                //const { data } = await axios.post('http://localhost:5000/broadcast', payload);
                socket.emit('publishstream',{roomid: roomid, payload:payload })
                
            }
        }
        getMedia()

        socket.on('hi',(message)=>{
            console.log(message);
        })

        socket.on('offer',(payload)=>{
            console.log('offer');
            const desc = new RTCSessionDescription(payload.sdp);
            peer.setRemoteDescription(desc).catch(e => console.log(e));
        })
       

    }, [])


    return (
        <div>

            <SenderSidebar open="false" />

            <video ref={videoRef} id="video" autoPlay={true} muted controls={false} />

    
        </div>
    );
}

export default Sender
