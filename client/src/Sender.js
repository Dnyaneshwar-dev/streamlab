import React from 'react'
import SenderSidebar from './SenderSidebar';
import { Container, Box } from '@mui/material';
import { useEffect } from 'react'
import { useRef } from 'react';
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux';
import { VIDEOSTREAM } from './redux/actions';

const Sender = () => {
    const videoRef = useRef(null)
    const dispatch = useDispatch()
    
    useEffect(() => {
        const getMedia = async () => {

            const stream = await navigator.mediaDevices.getUserMedia({ video:true , audio:true})
           // const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
            videoRef.current.srcObject = stream

            dispatch({type:VIDEOSTREAM,data:stream})
           

            const peer = createPeer()

            stream.getTracks().forEach(track => peer.addTrack(track,stream))

            function createPeer() {
                const peer = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: ["stun:stun.stunprotocol.org","stun:stun1.faktortel.com.au:3478",
                "stun:stun1.l.google.com:19302",
                "stun:stun1.voiceeclipse.net:3478",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302"]
                        }
                    ]
                });
                peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

                return peer;
            }

            async function handleNegotiationNeededEvent(peer) {
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                const payload = {
                    sdp: peer.localDescription
                };

                const { data } = await axios.post('http://localhost:5000/broadcast', payload);
                const desc = new RTCSessionDescription(data.sdp);
                peer.setRemoteDescription(desc).catch(e => console.log(e));
            }
        }
        getMedia()
        
    }, [])


    return (
        <div>

            <SenderSidebar open="false" />

            <video ref={videoRef} id="video" autoPlay={true} muted/>

        </div>
    );
}

export default Sender
