import useSWR from "swr"
import {
    Box,
    Link,
    IconButton,
    Modal,
    Button,
    Typography,
    TextField,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import React from "react"
import BoardDisplayCard from "../components/BoardDisplayCard"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUser from "../lib/useUser"
import httpPost from "../lib/httpPost"
import { Add } from "@mui/icons-material"

const theme = createTheme()
export default function AllBoards() {
    let { user } = useUser()
    // let { mutate } = useSWRConfig()
    const { data: boards, error, mutate: mutateBoards } = useSWR("/api/boards")

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
                                    <BoardDisplayCard
                                        board={board}
                                    ></BoardDisplayCard>

                                    {/* Add Post Grid here also :( */}
                                </Link>
                            </div>
                        )
                    })}

                    <ThemeProvider theme={theme}></ThemeProvider>
                    <IconButton
                        onClick={async () => {
                            let response = await httpPost(`/api/boards/add`, {
                                name: "aaaa",
                                posts: [],
                                users: [user.username],
                                settings: {},
                            }).then((body) => body.json())

                            let newBoard = await fetch(
                                `/api/boards/${response.insertedId}`
                            ).then((body) => body.json())
                            mutateBoards([...boards, newBoard])
                        }}
                    >
                        +
                    </IconButton>

                    <BasicModal></BasicModal>
                </ul>
            </Box>
        </>
    )
}

//modals for me

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
}

function BasicModal() {
    const [open, setOpen] = React.useState(false)

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                endIcon={<Add />}
                onClick={() => setOpen(true)}
            >
                Open Modal
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description">
                        More text in a modal
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}
