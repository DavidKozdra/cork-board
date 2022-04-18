import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUser from "../lib/useUser"
import httpPost from "../lib/httpPost"
import { useState } from "react"

import { Link as RouterLink, useLocation } from "react-router-dom"

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    )
}

const theme = createTheme()

export default function Profile() {

    let { mutateUser } = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    })
    let [errorMsg, setErrorMsg] = useState("")

    let { user } = useUser()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        let data = await httpPost(`/api/user/delete/${user.id}`, {
        }).then((body) => body.json())
        if (data.error) {
            setErrorMsg(data.error)
            return
        }
        mutateUser(data)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
           
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    {user.username}        
                </Avatar>
                
    
                <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="change-password"
                            label="Change Password ? "
                            name="password"

                        />
                            

                <Button onClick={handleSubmit} style={{ "color": "red"}}>Remove your account </Button>
             
            </Container>
        </ThemeProvider>
    )
}
