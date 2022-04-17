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

export default function Register() {
    let { mutateUser } = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    })
    let [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        let data = await httpPost("/api/users/add", {
            username: formData.get("username"),
            password: formData.get("password"),
            email: formData.get("email"),
            dateCreated: new Date(),
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
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            id="email"
                            autoComplete="email"
                        />
                        {errorMsg ? (
                            <Typography color="error">{errorMsg}</Typography>
                        ) : (
                            <></>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link  component={RouterLink}
                                    to={`/login`}>
                                    {"Already have an account? Login"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    )
}
