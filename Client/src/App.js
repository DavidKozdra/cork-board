import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import React from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import "./App.css"
import AllBoards from "./views/AllBoards"
import BoardView from "./views/BoardView"

function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <AllBoards />
                    </Route>
                    <Route path="/board/:id">
                        <BoardView />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
