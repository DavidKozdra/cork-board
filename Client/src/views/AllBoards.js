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

var boord = "New-Board"

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
                                {/*
                                    Temporarily removed this for testing, maybe can add back after
                                <Link
                                    component={RouterLink}
                                    to={`/board/${board._id}`}
                                > */}
                                <BoardDisplayCard
                                    board={board}
                                ></BoardDisplayCard>

                                {/* Add Post Grid here also :( */}
                                {/* </Link> */}
                            </div>
                        )
                    })}


                    <Typography><br /></Typography>
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
    
    let { user } = useUser()
    const { data: boards, error, mutate: mutateBoards } = useSWR("/api/boards")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        console.log(formData)
        
        boord = formData.get("BoardName");

        let response = await httpPost(`/api/boards/add`, {
            name: boord,
            posts: [],
            users: [user.username],
            settings: {},
        }).then((body) => body.json())

        let newBoard = await fetch(
            `/api/boards/${response.insertedId}`
        ).then((body) => body.json())
        mutateBoards([...boards, newBoard])        
        setOpen(false)
    }
    
    
    const [open, setOpen] = React.useState(false)

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                endIcon={<Add />}
                onClick={() => setOpen(true)}
            >
                New Board
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}
                component="form"
                onSubmit={handleSubmit}
                noValidate
                >
                    <Typography>
                        Create a Board!
                    </Typography>

                    <TextField
                        id="BoardName"
                        label="BoardName"
                        name="BoardName"
                        required
                    >
                    </TextField>

                    <Typography> 
                        <br />
                    </Typography>
                    
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary">   
                     Create New Board   
                    </Button>

                </Box>
            </Modal>
        </div>
    )
}
