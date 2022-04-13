import GridLayout from "react-grid-layout"
import React from "react"

export function PostsGrid({ posts }) {
    return (
        <GridLayout
            className="board-grid"
            rowHeight={50}
            width={1200}
            cols={12}
            onLayoutChange={(l) => console.log(l)}
            compactType={null}
        >
            {posts.map((post) => {
                let grid = {
                    ...post.shape,
                    minW: 1,
                    maxW: 4,
                    minH: 1,
                    maxH: 4,
                    static: false,
                }
                return (
                    <div key={post.id} data-grid={grid}>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </div>
                )
            })}
        </GridLayout>
    )
}
