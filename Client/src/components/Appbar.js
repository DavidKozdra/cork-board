import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Link,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material"
import { Link as RouterLink, useLocation } from "react-router-dom"

import useUser from "../lib/useUser"
import { ArrowBack, Person } from "@mui/icons-material"
import { useState } from "react"
import httpPost from "../lib/httpPost"



function ProfileButton() {
    const { mutateUser } = useUser()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = async (a) => {
        if (a.target.id === "logout-button") {
            let resp = await httpPost("/api/auth/logout")
            mutateUser(await resp.json())
        }
        setAnchorEl(null)
    }
    return (
        <div>
            <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ ml: 1 }}
                onClick={handleClick}
            >
                <Person />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem id="profile">
                <Link  component={RouterLink}
                                    to={`/profile`}>
                                    {"Profile"}
                </Link>
                </MenuItem>
                <MenuItem id="logout-button" onClick={handleClose}>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    )
}

export default function Appbar() {
    let { user } = useUser()
    let { pathname } = useLocation()

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar>
                <Toolbar>
                    {pathname !== "/" ? (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            component={RouterLink}
                            to={"/"}
                        >
                            <ArrowBack />
                        </IconButton>
                    ) : (
                        <></>
                    )}

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        <Link style={{"color":"white"}}  component={RouterLink}
                                    to={`/`}>
                        Corkboard
                        </Link>
                    </Typography>
                    {user?.isLoggedIn ? (
                        <>
                            <Typography color="inherit">
                                {user.username}
                            </Typography>
                            <ProfileButton />
                        </>
                    ) : (
                        <Link color="#fff" href="/login">Login</Link>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    )
}
