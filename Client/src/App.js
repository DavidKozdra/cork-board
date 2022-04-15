import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import React from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import "./App.css"
import AllBoards from "./views/AllBoards"
import BoardView from "./views/BoardView"

import Appbar from "./components/Appbar"
import Login from "./views/Login"

function App() {
    return (
        <>
            <Router>
                <Appbar />
                <Switch>
                    <Route exact path="/">
                        <AllBoards />
                    </Route>
                    <Route path="/board/:id">
                        <BoardView />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
