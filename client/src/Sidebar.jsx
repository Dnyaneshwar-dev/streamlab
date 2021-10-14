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

const Sidebar = (props) => {

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
                            <ScreenSearchDesktopOutlinedIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', textAlign: "center", height: "70px", width: "70px" }}>

                        <Button>
                            <LinkedCameraOutlinedIcon sx={{ color: "black", fontSize: 35 }} />
                        </Button>
                    </Box>
                </Stack>
            </Drawer>
        </>
    )
}

export default Sidebar
