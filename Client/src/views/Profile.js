import * as React from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUser from "../lib/useUser"
import httpPost from "../lib/httpPost"
import { useState } from "react"


const theme = createTheme()

export default function Profile() {

    let { mutateUser } = useUser({
        redirectTo: "/Profile",
        redirectIfFound: true,
    })
    let [errorMsg, setErrorMsg] = useState("")

    let { user } = useUser()
    console.log(user)
    const handleSubmit = async (event) => {
        event.preventDefault()
        let data = await httpPost(`/api/user/remove`, {
        }).then((body) => body.json())
        if (data.error) {
            setErrorMsg(data.error)
            return
        }
        mutateUser(data)
    }

    const updatePassword = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        
        let data = await httpPost(`/api/user/update`, {
            password: formData.get("password"),
        }).then((body) => body.json())
        if (data.error) {
            setErrorMsg(data.error)
            return
        }
        mutateUser(data)
    }
//
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
           
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    {user.username}        
                </Avatar>
                
                <Box
                        component="form"
                        onSubmit={updatePassword}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="change-password"
                            label="Change Password ? "
                            name="password"

                        />
                            
                            <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Change Password
                    </Button>
                </Box>
                <Button onClick={handleSubmit} style={{ "color": "red"}}>Remove your account </Button>

            </Container>
        </ThemeProvider>
    )
}
