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
                <AddPostModal board={board}></AddPostModal>

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

function AddPostModal({ board }) {
    let { user } = useUser()
    const { data: posts, error, mutate: mutatePosts } = useSWR("/api/posts")

    // modal
    const [open, setOpen] = React.useState(false)

    // toggle button
    const [selected, setSelected] = React.useState(false)

    // date picker
    const [value, setValue] = React.useState(new Date())

    // errors
    let [errorMsg, setErrorMsg] = React.useState("")

    // currently storing in unix time
    const handleChange = (newValue) => {
        setValue(newValue)
    }

    /* TODO: need to check the expiration date being unix time vs other format
    // handle pictures
    // handle reactions
    */
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        console.log(formData)
        // console.log("name: " + formData.get("PostName"));
        // console.log("content: " + formData.get("PostContent"));
        // console.log("toggle: " + selected);
        // console.log("date time: " + value);

        let postData = {
            title: formData.get("PostName"),
            body: formData.get("PostContent"),
            datePosted: new Date(),
            expiration: undefined,
            boardid: board._id,
        }
        console.log(postData)

        if (selected) {
            if (+value < +moment()) {
                setErrorMsg(
                    "Error: Expiration date/time cannot be in the past."
                )
                return
            }
            postData.expiration = value.toDate()
        }

        // Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});

        // let postObj = {
        //     header: req.body.header,
        //     pictures: req.body.pictures,
        //     reaction: req.body.reaction,
        //     authorid: req.body.authorid,
        //     datePosted: req.body.datePosted,
        //     expiration: req.body.expiration,
        // }
        let postResponse = await httpPost(`/api/posts/add`, postData).then(
            (body) => body.json()
        )
        if (postResponse.error) {
            // console.log("error")
            setErrorMsg(postResponse.error)
            return
        }

        // let boardResponse = await httpPost(
        //     `/api/boards/${board._id}/posts/add/${postResponse.insertedId}`,
        //     { author: user.username }
        // ).then((body) => body.json())

        // if (boardResponse.error) {
        //     // console.log("error")
        //     setErrorMsg(boardResponse.error)
        //     return
        // }
        let newPost = postResponse.post

        // let newPost = await fetch(`/api/posts/${postResponse.insertedId}`).then(
        //     (body) => body.json()
        // )

        // if (newPost.error) {
        //     // console.log("error")
        //     setErrorMsg(newPost.error)
        //     return
        // }

        mutatePosts([...posts, newPost])
        // console.log(newPost)
        // console.log(posts)
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                endIcon={<Add />}
                onClick={() => {
                    setOpen(true)
                    setValue(new Date())
                }}
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
                                //console.log("selected", selected)
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

                    {errorMsg ? (
                        <Typography
                            sx={{ mt: 3, textAlign: "center" }}
                            color="error"
                        >
                            {errorMsg}
                        </Typography>
                    ) : (
                        <></>
                    )}
                </Box>
            </Modal>
        </div>
    )
}
