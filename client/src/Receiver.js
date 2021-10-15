import React from 'react'
import ReceiverSidebar from './ReceiverSidebar';
import { Container, Box } from '@mui/material';
import { useEffect } from 'react'
import { useRef } from 'react';
import axios from 'axios'

const Sender = () => {
    const senderVideo = useRef(null)

    useEffect(() => {
        const setMedia = async () => {
              
            const peer = createPeer()
            peer.addTransceiver("video", { direction: "recvonly" })
            peer.addTransceiver("audio",{ direction: "recvonly"})

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

                const { data } = await axios.post('http://localhost:5000/consumer', payload);
                const desc = new RTCSessionDescription(data.sdp);
                peer.setRemoteDescription(desc).catch(e => console.log(e));
            }

        }
        setMedia()
    }, [])

    return (
        <div>

            <ReceiverSidebar open="false" />

            <video ref={senderVideo} autoPlay={true} />

        </div>
    );
}

export default Sender
