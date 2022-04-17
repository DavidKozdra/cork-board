import GridLayout from "react-grid-layout"
import React from "react"
import httpPost from "../lib/httpPost"
import PostCard from "./PostCard"

export function PostsGrid({ posts }) {
    function updatePos(updated) {
        for (let l of updated) {
            httpPost(`/api/boards/${1}/posts/${l.i}/updatepos`, {
                id: l.i,
                gridData: l,
            })
        }
    }

    return (
        <GridLayout
            className="board-grid"
            rowHeight={50}
            width={1200}
            cols={12}
            onDragStop={updatePos}
            onResizeStop={updatePos}
            compactType={null}
        >
            {(posts??[]).map((post) => {
                let grid = {
                    ...post.shape,
                    minW: 1,
                    maxW: 4,
                    minH: 1,
                    maxH: 4,
                }

                return (
                    <div style={{fontSize: "5%"}} key={post._id} data-grid={grid}>

                        <PostCard posts={post} title={post.title} content={post.body} author={post.author} MaxWidth={ grid.maxW}>
                            
                            
                        </PostCard>


                    </div>

        
                )
            })}
        </GridLayout>
    )
}
