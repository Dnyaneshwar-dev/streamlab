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
import { useEffect } from 'react'
import { store } from './redux/store'
import { useState } from 'react'


const SenderSidebar = (props) => {

    const handleMic = (stream) =>{
        stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
    }

    const handleVideo = (stream) =>{
        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
    }
    useEffect(()=>{
        
    },[])

    const [video,toggleVideo] = useState(true)
    const [mic,toggleMic] = useState(true)

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

                        <Button>
                            <ChatIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button>
                            <HelpOutlineRoundedIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button>
                            <ScreenShareOutlinedIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button onClick={()=>{
                            const stream = store.getState().commonReducer.videostream
                            console.log(stream);
                            handleMic(stream)
                            toggleMic(!mic)
                        }}>
                        {
                            mic ? <MicNoneIcon sx={{ color: "red", fontSize: 35 }} />:<MicOffIcon sx={{ color: "black", fontSize: 35 }} />
                        }  
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button onClick={()=>{
                            const stream = store.getState().commonReducer.videostream
                            console.log(stream);
                            handleVideo(stream)
                            toggleVideo(!video)
                        }}>
                        {
                            video ? <VideocamOutlinedIcon sx={{ color: "red", fontSize: 35 }} /> : <VideocamOffOutlinedIcon sx={{ color: "black", fontSize: 35 }}/>
                        }
                        </Button>
                    </Box>
                </Stack>
            </Drawer>
        </>
    )
}

export default SenderSidebar
