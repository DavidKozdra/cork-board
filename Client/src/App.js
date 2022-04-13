import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import React from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import useSWR from "swr"

import "./App.css"
import { BoardGrid } from "./components/BoardGrid"

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
                        <BoardGrid items={board.items}></BoardGrid>
                    </Container>
                </Box>
            </main>
        </>
    )
}

function App() {
    let _boards = [
        {
            name: "My Board",
            items: [
                {
                    shape: { x: 0, y: 0, w: 1, h: 1 }, // TODO: For testing only
                    isOwn: false,
                    content: "A",
                    id: "foo",
                },
                {
                    // TODO: For testing only
                    isOwn: true,
                    shape: { x: 1, y: 1, w: 3, h: 1 },
                    content: "B",
                    id: "bar",
                },
                {
                    // TODO: For testing only
                    isOwn: true,
                    shape: { x: 4, y: 0, w: 1, h: 1 },
                    content: "C",
                    id: "baz",
                },
            ],
        },
    ]

    return (
        <div>
            <BoardPage id={"625738b47be14bf35d9fa8f9"}></BoardPage>
            {/*<AppBar>*/}
            {/*    <Toolbar>*/}
            {/*        <Typography variant="h6" color="inherit" noWrap>*/}
            {/*            {Object.keys(boards)[0]}*/}
            {/*        </Typography>*/}
            {/*    </Toolbar>*/}
            {/*</AppBar>*/}
            {/*<main>*/}
            {/*    <Box*/}
            {/*        sx={{*/}
            {/*            bgcolor: "background.paper",*/}
            {/*            pt: 8,*/}
            {/*            pb: 6,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Container>*/}
            {/*            <BoardGrid items={Object.values(boards)[0]}></BoardGrid>*/}
            {/*        </Container>*/}
            {/*    </Box>*/}
            {/*</main>*/}
        </div>
    )
}

export default App
