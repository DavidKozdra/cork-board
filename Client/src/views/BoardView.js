import { useParams, Link as RouterLink } from "react-router-dom"
import React from "react"
import useSWR from "swr"
import {
    AppBar,
    Box,
    Container,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material"
import { PostsGrid } from "../components/PostsGrid"
import { ArrowBack } from "@mui/icons-material"

export default function BoardView() {
    const { id } = useParams()
    const { data: board, error } = useSWR(`/api/boards/${id}`)

    let body
    if (!id) body = <p>Select a board</p>

    if (error) body = <p>An error occurred fetching the board... {error}</p>
    if (board === null) body = <p>Error: Board does not exist</p>
    if (!board) body = <p>Loading board..</p>
    if (board) body = <PostsGrid posts={board.posts}></PostsGrid>

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar>
                    <Toolbar>
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
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            {board ? board.name : "Loading.."}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box
                sx={{
                    bgcolor: "background.paper",
                    pt: 8,
                    pb: 6,
                }}
            >
                <Container>{body}</Container>
            </Box>
        </>
    )
}
