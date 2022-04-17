import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import httpPost from "../lib/httpPost"


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  /*
  const handleRemove = async (event) => {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget)
    let data = await httpPost(`/api/boards/remove/${post._id}`).then((body) => body.json())
    if (data.error) {
      setErrorMsg(data.error)
      return
    }
    mutate(`/api/boards`, (post) => {
      return post.filter((x)=>x._id !==post._id)
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
*/

  return (
    <Card sx={{ maxWidth: props.maxWidth }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.posts.author.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.posts.author}
        subheader={ props.posts.date }
      />
      <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="img placeholder"
      />
      <CardContent>
        <Typography paragraph>
            { props.posts.content }
          </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>

        
        {/*(user.username === post.author) ? <Button size="small" onClick={handleEdit}> Edit </Button> : <></>*/}
        
        {/*(user.username === post.author) ? <Button size="small" onClick={handleRemove}> Edit </Button> : <></>*/}

      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Replies:</Typography>

          
        </CardContent>
      </Collapse>
    </Card>
  );
}
