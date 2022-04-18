import { useParams } from "react-router-dom"
import React from "react"
import useSWR from "swr"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { PostsGrid } from "../components/PostsGrid"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import useUser from "../lib/useUser"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined"
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined"
import httpPost from "../lib/httpPost"

import {
    Box,
    Container,
    Link,
    IconButton,
    Modal,
    Button,
    Typography,
    TextField,
} from "@mui/material"
import { Add } from "@mui/icons-material"
import moment from "moment"

export default function BoardView() {
    const { id } = useParams()
    const { data: board, error } = useSWR(`/api/boards/${id}`)

    let body
    if (!id) body = <p>Select a board</p>

    if (error) body = <p>An error occurred fetching the board... {error}</p>
    if (board === null) body = <p>Error: Board does not exist</p>
    if (!board) body = <p>Loading board..</p>
    if (board) body = <PostsGrid posts={board.posts}></PostsGrid>

    return (
        <>
            <Box
                sx={{
                    bgcolor: "background.paper",
                    pt: 8,
                    pb: 6,
                }}
            >
                <Typography>
                    <br />
                </Typography>
                <AddPostModal></AddPostModal>

                <Container>{body}</Container>
            </Box>
        </>
    )
}

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

function AddPostModal() {
    let { user } = useUser()
    const { data: posts, error, mutate: mutatePosts } = useSWR("/api/posts")

    // modal
    const [open, setOpen] = React.useState(false)

    // toggle button
    const [selected, setSelected] = React.useState(false)

    // date picker
    const [value, setValue] = React.useState(new Date())

    // currently storing in unix time
    const handleChange = (newValue) => {
        setValue(newValue)
    }

    /* TODO: need to check the expiration date being unix time vs other format
    // handle pictures
    // handle reactions
    // authorid on server side?
    // add post to the associated board
    */
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        // console.log("name: " + formData.get("PostName"));
        // console.log("content: " + formData.get("PostContent"));
        // console.log("toggle: " + selected);
        // console.log("date time: " + value);

        let data = {
            header: formData.get("PostName"),
            posted_data: formData.get("PostContent"),
            datePosted: new Date(),
            expiration: 0,
        }

        if (selected) data.expiration = value
        else data.expiration = undefined

        // Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});

        // let postObj = {
        //     header: req.body.header,
        //     pictures: req.body.pictures,
        //     reaction: req.body.reaction,
        //     authorid: req.body.authorid,
        //     datePosted: req.body.datePosted,
        //     expiration: req.body.expiration,
        // }

        let response = await httpPost(`/api/posts/add`, data).then((body) =>
            body.json()
        )

        // let newPost = await fetch(
        //     `/api/posts/${response.insertedId}`
        // ).then((body) => body.json())
        // mutatePosts([...posts, newPost])
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                endIcon={<Add />}
                onClick={() => setOpen(true)}
            >
                New Post
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="post-modal-title"
                aria-describedby="post-modal-description"
            >
                <Box
                    sx={style}
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Typography
                        sx={{
                            pb: 2,
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                        }}
                    >
                        Create a Post
                    </Typography>

                    <TextField
                        id="PostName"
                        label="Post Name"
                        name="PostName"
                        required
                        sx={{
                            mb: 3,
                            width: "100%",
                        }}
                    ></TextField>

                    <TextField
                        id="PostContent"
                        label="Post Content"
                        name="PostContent"
                        required
                        sx={{
                            mb: 3,
                            width: "100%",
                        }}
                    ></TextField>

                    <Typography
                        sx={{
                            fontSize: "1rem",
                            mb: 3,
                        }}
                    >
                        Expiration Date/Time?
                        <ToggleButton
                            id="ExpireToggle"
                            name="ExpireToggle"
                            size="medium"
                            sx={{
                                backgroundColor: "background.white !important",
                                border: "none !important",
                            }}
                            value="check"
                            selected={selected}
                            onChange={() => {
                                setSelected(!selected)
                                console.log("selected", selected)
                            }}
                        >
                            {selected ? (
                                <ToggleOnOutlinedIcon />
                            ) : (
                                <ToggleOffOutlinedIcon />
                            )}
                        </ToggleButton>
                    </Typography>

                    {selected ? (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                                id="ExpireDateTime"
                                name="ExpireDateTime"
                                label="Expiration Date"
                                value={value}
                                onChange={handleChange}
                                disablePast
                                minTime={moment()}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                    ) : (
                        <></>
                    )}

                    <Typography>
                        <br />
                    </Typography>
                    <Button type="submit" variant="contained" color="primary">
                        Create New Post
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}
