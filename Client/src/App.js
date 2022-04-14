import {
    AppBar,
    Box,
    Container,
    Toolbar,
    Typography,
    Link,
} from "@mui/material"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link as RouterLink,
    useParams,
    Redirect,
} from "react-router-dom"
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

function BoardGrid() {
    const { data: boards, error } = useSWR("/api/boards")

    if (error) return <p>An error occurred loading boards...</p>
    if (!boards) return <p>Loading boards...</p>

    return (
        <ul>
            {boards.map((board) => {
                return (
                    <div key={board._id}>
                        <Link component={RouterLink} to={`/board/${board._id}`}>
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

function BoardView() {
    const { id } = useParams()
    return (
        <div>
            {id ? <BoardPage id={id}></BoardPage> : <p>Select a board</p>}
        </div>
    )
}

function App() {
    return (
        <>
            <Router>
                <Redirect exact from="/" to="boards" />
                <Switch>
                    <Route path="/boards">
                        <Box
                            sx={{
                                bgcolor: "background.paper",
                                pt: 8,
                                pb: 6,
                            }}
                        >
                            <BoardGrid />
                        </Box>
                    </Route>
                    <Route path="/board/:id">
                        <BoardView />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
