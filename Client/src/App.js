import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import React from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import "./App.css"
import { BoardGrid } from "./components/BoardGrid"

function App() {
    let boards = {
        "My Board": [
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
    }

    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        {Object.keys(boards)[0]}
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
                        <BoardGrid boards={boards[0]}></BoardGrid>
                    </Container>
                </Box>
            </main>
        </div>
    )
}

export default App
