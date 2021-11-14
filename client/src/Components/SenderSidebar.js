import React from 'react'
import Drawer from '@mui/material/Drawer'
import { AppBar, Button } from '@mui/material'
import { MenuItem } from '@mui/material'
import companyLogo from './brand.svg'
import Stack from '@mui/material/Stack';
import { Tabs, Tab, TabPanel } from '@mui/material'
import { NavLink } from 'react-router-dom'
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import Container from '@mui/material/Container';
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined';
import LinkedCameraOutlinedIcon from '@mui/icons-material/LinkedCameraOutlined';
import Box from '@mui/material/Box'
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Widget, addResponseMessage, addLinkSnippet, addUserMessage, setQuickButtons } from 'react-chat-widget';
import adapter from 'webrtc-adapter';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect } from 'react'
import { store } from '../redux/store'
import { useState } from 'react'
import { socket } from './socketConnection'
import config from './config'
const SenderSidebar = (props) => {
    const p = new URLSearchParams(window.location.hash.substring(6))
    const roomid = p.get('roomid')
    const passcode = p.get('passcode')
    const handleNewUserMessage = newMessage => {

        socket.emit('message', { name: 'host', message: newMessage, roomid: roomid });

        // console.log(`New message incoming! ${newMessage}`);
        // Now send the message throught the backend API
        // addResponseMessage('hi')
    };



    let screenpeer
    async function shareScreen() {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })

        screenpeer = createPeer()

        screen.getTracks().forEach(track => screenpeer.addTrack(track, screen))

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
            socket.emit('publishscreen', { roomid: roomid, payload: payload })

        }
    }

    const handleMic = (stream) => {
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
    }

    const handleVideo = (stream) => {
        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
    }
    useEffect(() => {
        socket.on('screenoffer', async (payload) => {
            console.log('screenoffer');
            const desc = new RTCSessionDescription(payload.sdp);
            await screenpeer.setRemoteDescription(desc).catch(e => console.log(e));
        })

        socket.on('newmessage', ({ name, message }) => {
            addResponseMessage(`${name}: ${message}`)
        })

    }, [])

    const [video, toggleVideo] = useState(true)
    const [mic, toggleMic] = useState(true)

    return (
        <>
            <Drawer anchor='right' variant='permanent'
                sx={{
                    width: 100,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 70,
                        boxSizing: 'border-box',
                    }
                }}
                openSecondary={true}
                open={props.open}
            >

                <img src={companyLogo} width="auto" />

                <br />
                <Stack spacing={1}>

                    

                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>
                        <Tooltip title="Share Screen" aria-label="share" >
                                
                           
                        <Button onClick={() => {
                            shareScreen();
                        }}>
                            <ScreenShareOutlinedIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button onClick={() => {
                            const stream = store.getState().commonReducer.videostream
                            console.log(stream);
                            handleMic(stream)
                            toggleMic(!mic)
                        }}>
                            {
                                mic ? <MicNoneIcon sx={{ color: "red", fontSize: 35 }} /> : <MicOffIcon sx={{ color: "black", fontSize: 35 }} />
                            }
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>
                        
                        <Button onClick={() => {
                            const stream = store.getState().commonReducer.videostream
                            socket.emit('chat', { roomid: "abc", message: 'mic' })
                            handleVideo(stream)
                            toggleVideo(!video)
                        }}>
                            {
                                video ? <VideocamOutlinedIcon sx={{ color: "red", fontSize: 35 }} /> : <VideocamOffOutlinedIcon sx={{ color: "black", fontSize: 35 }} />
                            }
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>
                        <CopyToClipboard text={`${window.location.protocol}//${window.location.hostname}/#/join?roomid=${roomid}&passcode=${passcode}`}>
                            <Tooltip title="Copy Joining Link" aria-label="share" >
                                <Button className="btn btn-outline-light" id="icons" > <ContentCopyIcon /></Button>
                            </Tooltip>
                        </CopyToClipboard>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>
                        <Widget
                            handleNewUserMessage={handleNewUserMessage}
                            title="Chat"
                            subtitle=""
                        />
                    </Box>
                </Stack>
            </Drawer>
        </>
    )
}

export default SenderSidebar
