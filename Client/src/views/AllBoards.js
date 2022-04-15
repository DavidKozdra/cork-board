import useSWR from "swr"
import { Box, Link } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import React from "react"

export default function AllBoards() {
    const { data: boards, error } = useSWR("/api/boards")

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
                                    <p>
                                        {board.name} managed by {board.admin}
                                    </p>
                                </Link>
                            </div>
                        )
                    })}
                </ul>
            </Box>
        </>
    )
}
