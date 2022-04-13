import GridLayout from "react-grid-layout";
import React from "react";

export function BoardGrid(props) {
  return (
    <GridLayout
      className="board-grid"
      rowHeight={50}
      width={1200}
      cols={12}
      onLayoutChange={(l) => console.log(l)}
      compactType={null}
    >
      {props.boards.map((board) => {
        let grid = {
          ...board.shape,
          minW: 1,
          maxW: 4,
          minH: 1,
          maxH: 4,
          static: !board.isOwn,
        };
        return (
          <div key={board.id} data-grid={grid}>
            {board.content}
          </div>
        );
      })}
    </GridLayout>
  );
}
