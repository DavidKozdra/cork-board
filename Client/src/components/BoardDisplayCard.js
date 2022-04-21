import * as React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material"
import { useRef } from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { PostsGrid } from "./PostsGrid"
import useUser from "../lib/useUser"
import { useState } from "react"
import httpPost from "../lib/httpPost"
import { useSWRConfig } from "swr"
import { Edit } from "@mui/icons-material"
import { Link } from "react-router-dom"

const bull = (
    <Box
        component="span"
        sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
        •
    </Box>
)

export default function BoardDisplayCard({ board }) {
    const { mutate } = useSWRConfig()

    let [errorMsg, setErrorMsg] = useState("")

    let { mutateUser } = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    })

    const handleRemove = async (event) => {
        event.preventDefault()
        // const formData = new FormData(event.currentTarget)
        let data = await httpPost(`/api/boards/remove/${board._id}`).then(
            (body) => body.json()
        )
        if (data.error) {
            setErrorMsg(data.error)
            return
        }
        mutate(`/api/boards`, (boards) => {
            return boards.filter((x) => x._id !== board._id)
        })
        // mutate('/api/boards', data)
    }

    function handleChange(event) {
        // reload boards on change
        mutate(`/api/boards`, (boards) => {
            return boards
        })
    }
    var { user } = useUser()
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography
                    sx={{
                        fontSize: 21,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    color="text.secondary"
                    gutterBottom
                >
                    {board.name}
                </Typography>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                >
                    {"managed by - " + board.admin}
                    {"\n" + board.posts.length + "  posts"}
                </Typography>
                {/*
        <PostsGrid posts={props.posts} style={{ "transform": "scale(.3)" }}>
        </PostsGrid>
        */}
            </CardContent>
            <CardActions>
                <Button size="small">
                    <Link to={`/board/${board._id}`}>View</Link>
                </Button>

                {user.username === board.admin ? (
                    <EditModal board={board} onChange={handleChange} />
                ) : (
                    <></>
                )}
                {user.username === board.admin ? (
                    <Button size="small" onClick={handleRemove}>
                        {" "}
                        Remove{" "}
                    </Button>
                ) : (
                    <></>
                )}
            </CardActions>
        </Card>
    )
}

// TODO: This definitely needs to be cleaned up
// hacked together for now

function EditModal({ board, onChange }) {
    const [open, setOpen] = React.useState(false)
    let [errorMsg, setErrorMsg] = useState("")

    const valueRef = useRef("")

    const handleEdit = async (event) => {
        if (valueRef === undefined) return
        // Remove undefined keys
        // Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});
        //
        let values = {
            name: valueRef.current.value,
            posts: board.posts,
            users: board.users,
            admin: board.admin,
            settings: board.settings,
        }
        let data = await httpPost(
            `/api/boards/update/${board._id}`,
            values
        ).then((body) => body.json())
        // console.log("data: " + data)
        if (data.error) {
            // console.log("error")
            setErrorMsg(data.error)
            return
        }
        // console.log("no error check")
        onChange(event)
        setOpen(false)
    }

    function handleOpen() {
        // Clear errors on open
        setErrorMsg("")
        setOpen(true)
    }

    return (
        <div>
            <Button onClick={handleOpen}>Edit</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Edit Board</DialogTitle>
                <DialogContent>
                    <DialogContentText>Edit the board name</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Board Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={valueRef}
                    />
                    {errorMsg ? (
                        <Typography color="error">{errorMsg}</Typography>
                    ) : (
                        <></>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleEdit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
