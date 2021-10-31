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

const Sender = () => {
    const history = useHistory();
    const senderVideo = useRef(null)
    const [data, setLoad] = useState({})
    const senderScreen = useRef(null)




    useEffect(async () => {
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

        socket.on('videostream', (e) => {
            console.log('video');
            const desc = new RTCSessionDescription(e.payload.sdp);
            peer.setRemoteDescription(desc).catch(e => console.log(e));

        })

        socket.on('screenstream', (e) => {
            console.log('screen')

            const desc = new RTCSessionDescription(e.payload.sdp);
            peer2.setRemoteDescription(desc).catch(e => console.log(e));

        })

        socket.on('screenalert', (e) => {
            console.log(e.message);
            setScreen()
        })

        socket.on('videoalert', (e) => {

        })

    }, [])

    return (
        <div>

            <ReceiverSidebar open="false" />

            <video ref={senderVideo} autoPlay controls={true} />
            <video ref={senderScreen} autoPlay controls={true} />

        </div>
    );
}

export default Sender
