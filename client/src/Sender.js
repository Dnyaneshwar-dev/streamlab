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

const Sender = () => {

    const videoRef = useRef()
    const dispatch = useDispatch()
    

    useEffect(() => {

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
                socket.emit('publishstream',{roomid: "abc", payload:payload })
                
            }
        }

        socket.emit('join','abc')

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
