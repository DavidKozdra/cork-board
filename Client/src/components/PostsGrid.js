import GridLayout from "react-grid-layout"
import React from "react"

export function PostsGrid({ posts }) {

    function updatePos(updated) {
            for (let l of updated) {
                console.log(l)
                fetch(`/api/boards/${1}/posts/${l.i}/updatepos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: l.i, gridData: l }),
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
            {posts.map((post) => {
                let grid = {
                    ...post.shape,
                    minW: 1,
                    maxW: 4,
                    minH: 1,
                    maxH: 4,
                }

                return (
                    <div key={post._id} data-grid={grid}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                        <small>
                            By <strong>{post.author}</strong>
                        </small>
                    </div>
                )
            })}
        </GridLayout>
    )
}
