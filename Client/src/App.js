import {
    AppBar,
    Box,
    Container,
    Link,
    Toolbar,
    Typography,
} from "@mui/material"
import React, { useState } from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import useSWR from "swr"

import "./App.css"
import { PostsGrid } from "./components/PostsGrid"

function BoardPage({ id }) {
    const { data: board, error } = useSWR(`/api/boards/${id}`)
    console.log(board, error)
    if (error) return <p>An error occurred fetching the board... {error}</p>
    if (board === null) return <p>Error: Board does not exist</p>
    if (!board) return <p>Loading board..</p>

    return <Board board={board}></Board>
}

function Board({ board }) {
    return (
        <>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        {board.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container>
                        <PostsGrid posts={board.posts}></PostsGrid>
                    </Container>
                </Box>
            </main>
        </>
    )
}

function BoardGrid({ onClick }) {
    const { data: boards, error } = useSWR("/api/boards")

    if (error) return <p>An error occurred loading boards...</p>
    if (!boards) return <p>Loading boards...</p>

    return (
        <ul>
            {boards.map((board) => {
                return (
                    <div key={board._id}>
                        <Link onClick={() => onClick(board)} href="#">
                            <p>
                                {board.name} managed by {board.admin}
                            </p>
                        </Link>
                    </div>
                )
            })}
        </ul>
    )
}

function App() {
    let x = {
        name: "Foo",
        posts: [
            {
                id: "foo",
                title: "My Title",
                body: "My Body",
                author: "Noskcaj19",
                shape: { x: 1, y: 1, w: 3, h: 2 },
            },
            {
                id: "bar",
                title: "My Title 2",
                body: "My Body 2",
                author: "David",
                shape: { x: 2, y: 3, w: 4, h: 4 },
            },
        ],
        users: ["Noskcaj19"],
        admin: "Noskcaj19",
        settings: {},
    }
    console.log(JSON.stringify(x))

    const [currentBoard, setCurrentBoard] = useState(null)

    return (
        <>
            <Box
                sx={{
                    bgcolor: "background.paper",
                    pt: 8,
                    pb: 6,
                }}
            >
                <BoardGrid onClick={(board) => setCurrentBoard(board._id)}></BoardGrid>
            </Box>
            <div>
                {currentBoard ? (
                    <BoardPage id={currentBoard}></BoardPage>
                ) : (
                    <p>Select a board</p>
                )}
            </div>
        </>
    )
}

export default App
