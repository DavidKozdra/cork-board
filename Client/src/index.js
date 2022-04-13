import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { SWRConfig } from "swr"

ReactDOM.render(
    <React.StrictMode>
        <SWRConfig
            value={{
                fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
            }}
        >
            <App />
        </SWRConfig>
    </React.StrictMode>,
    document.getElementById("root")
)
