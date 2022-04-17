import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { PostsGrid } from './PostsGrid';
import useUser from "../lib/useUser";
import { useState } from "react"
import httpPost from "../lib/httpPost"
import { useSWRConfig } from 'swr';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BoardDisplayCard({ board }) {
  const { mutate }= useSWRConfig()

  let { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  })
  
  const handleRemove = async (event) => {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget)
    let data = await httpPost(`/api/boards/remove/${board._id}`).then((body) => body.json())
    if (data.error) {
      setErrorMsg(data.error)
      return
    }
    mutate(`/api/boards`, (boards) => {
      return boards.filter((x)=>x._id !==board._id)
    })
    // mutate('/api/boards', data)
  }
  
  const handleEdit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    let data = await httpPost(`/api/board/update/${board.id}`, {
    }).then((body) => body.json())
    if (data.error) {
        setErrorMsg(data.error)
        return
    }
}
  let [errorMsg, setErrorMsg] = useState("");
  var {user} = useUser();
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 21 }} color="text.secondary" gutterBottom>
            {board.name }
        </Typography>
              <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
          {"managed by - " + board.admin}
          {"\n" + board.posts.length + "  posts"}
        </Typography>
        {
        /*
        <PostsGrid posts={props.posts} style={{ "transform": "scale(.3)" }}>
        </PostsGrid>
        */
        }
      </CardContent>
      <CardActions>
        <Button size="small"> View </Button>

        
        {(user.username === board.admin) ? <Button size="small" onClick={handleEdit}> Edit </Button> : <></>}
        {(user.username === board.admin) ? <Button size="small" onClick={handleRemove}> Remove </Button> : <></>}
      </CardActions>

    </Card>
  );
}
