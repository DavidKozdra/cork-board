import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import React from "react"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import "./App.css"
import AllBoards from "./views/AllBoards"
import BoardView from "./views/BoardView"

import useUser from "./lib/useUser"
import Appbar from "./components/Appbar"
import Login from "./views/Login"
import Register from "./views/Register"

import Profile from "./views/Profile"

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

function ForceLogin() {
    useUser({
        redirectTo: "/login",
        redirectIfFound: false,
    })
    return <></>
}

function App() {
    return (
        <>
            <Router>
                <ForceLogin />
                <Appbar />
                <LocalizationProvider dateAdapter={AdapterMoment}>
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

                        <Route path="/register">
                            <Register />
                        </Route>

                        <Route path="/profile">
                            <Profile />
                        </Route>
                    </Switch>
                </LocalizationProvider>
            </Router>
        </>
    )
}

export default App
