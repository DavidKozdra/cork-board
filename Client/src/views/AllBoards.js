import useSWR from "swr"
import { Box, Link, IconButton } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import React from "react"
import BoardDisplayCard from "../components/BoardDisplayCard"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUser from "../lib/useUser"
import httpPost from "../lib/httpPost"


const theme = createTheme()
export default function AllBoards() {
    let { user } = useUser();
    // let { mutate } = useSWRConfig()
    const { data: boards, error, mutate:mutateBoards } = useSWR("/api/boards")

    if (error) return <p>An error occurred loading boards...</p>
    if (!boards) return <p>Loading boards...</p>

    return (
        <>
            <Box sx={{ flexGrow: 1, mt: 8 }}>
                <ul>
                    {boards.map((board) => {
                        return (
                            <div key={board._id}>
                                <Link
                                    component={RouterLink}
                                    to={`/board/${board._id}`}
                                >   
                                    <BoardDisplayCard board={ board} >

                                    </BoardDisplayCard>

                                    {/* Add Post Grid here also :( */}
                                </Link>
                            </div>
                        )
                    })}

                    <ThemeProvider theme={theme}>
                           
                    </ThemeProvider> 
                    <IconButton
                    onClick={async () => {
                        let response = await httpPost(`/api/boards/add`, {
                            name: "aaaa",
                            posts: [],
                            users: [],
                            admin: user.username,
                            settings: {},
                        }).then(body=>body.json())

                        let newBoard = await fetch(`/api/boards/${response.insertedId}`).then(body=>body.json())
                        mutateBoards([...boards, newBoard])
                        
                    }}
                    >
                    New
                    </IconButton>

                </ul>
                
            </Box>
        </>
    )
}
