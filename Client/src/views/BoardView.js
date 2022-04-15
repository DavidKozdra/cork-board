import { useParams } from "react-router-dom"
import React from "react"
import useSWR from "swr"
import { Box, Container } from "@mui/material"
import { PostsGrid } from "../components/PostsGrid"

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
