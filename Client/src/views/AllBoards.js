import useSWR from "swr"
import { Box, Link, IconButton, Modal, Button, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import React from "react"
import BoardDisplayCard from "../components/BoardDisplayCard"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useUser from "../lib/useUser"
import httpPost from "../lib/httpPost"

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
                                users: [],
                                admin: user.username,
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

                    <IconButton > ++ </IconButton>
                    
                    





                    

                </ul>
            </Box>
        </>
    )
}

//modals for me



function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
    );
}

